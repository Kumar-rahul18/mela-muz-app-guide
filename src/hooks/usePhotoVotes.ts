
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface PhotoVote {
  photo_id: string;
  user_identifier: string;
}

export const usePhotoVotes = () => {
  const [userVotes, setUserVotes] = useState<Set<string>>(new Set());
  const [votingStates, setVotingStates] = useState<Record<string, boolean>>({});

  // Generate a unique identifier for the user (using localStorage)
  const getUserIdentifier = () => {
    let userId = localStorage.getItem('photo_voter_id');
    if (!userId) {
      userId = 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
      localStorage.setItem('photo_voter_id', userId);
    }
    return userId;
  };

  // Load user's existing votes
  useEffect(() => {
    const loadUserVotes = async () => {
      const userIdentifier = getUserIdentifier();
      
      try {
        const { data, error } = await supabase
          .from('photo_votes')
          .select('photo_id')
          .eq('user_identifier', userIdentifier);

        if (error) {
          console.error('Error loading user votes:', error);
          return;
        }

        const votedPhotoIds = new Set(data?.map(vote => vote.photo_id) || []);
        setUserVotes(votedPhotoIds);
        console.log('Loaded user votes:', votedPhotoIds);
      } catch (error) {
        console.error('Error loading user votes:', error);
      }
    };

    loadUserVotes();
  }, []);

  const voteOnPhoto = async (photoId: string, onVoteSuccess?: (photoId: string) => void) => {
    const userIdentifier = getUserIdentifier();
    
    // Check if user has already voted
    if (userVotes.has(photoId)) {
      console.log('User has already voted for this photo');
      toast({
        title: "Already voted",
        description: "You have already voted for this photo.",
        variant: "default"
      });
      return;
    }

    // Prevent multiple simultaneous votes on the same photo
    if (votingStates[photoId]) {
      console.log('Vote already in progress for photo:', photoId);
      return;
    }

    console.log('Adding vote for photo:', photoId);
    setVotingStates(prev => ({ ...prev, [photoId]: true }));

    try {
      // Add vote to database - the trigger should automatically update vote_count now that RLS is fixed
      console.log('Attempting to add vote...');
      const { data: voteData, error: voteError } = await supabase
        .from('photo_votes')
        .insert([{
          photo_id: photoId,
          user_identifier: userIdentifier,
          vote_type: 'like'
        }])
        .select();

      if (voteError) {
        // Check if it's a duplicate vote error
        if (voteError.code === '23505' || voteError.message?.includes('unique_user_photo_vote')) {
          console.log('Duplicate vote detected, updating local state...');
          setUserVotes(prev => new Set([...prev, photoId]));
          toast({
            title: "Already voted",
            description: "You have already voted for this photo.",
            variant: "default"
          });
          return;
        }
        console.error('Error adding vote:', voteError);
        throw voteError;
      }

      console.log('Vote added successfully to photo_votes:', voteData);

      // Update local user votes state
      setUserVotes(prev => {
        const newSet = new Set([...prev, photoId]);
        console.log('Updated user votes after addition:', newSet);
        return newSet;
      });

      // Call the success callback immediately for optimistic UI update
      if (onVoteSuccess) {
        onVoteSuccess(photoId);
      }
      
      // Verify that the trigger updated the vote count after a short delay
      setTimeout(async () => {
        const { data: updatedPhoto, error: fetchError } = await supabase
          .from('photo_contest_submissions')
          .select('vote_count')
          .eq('id', photoId)
          .single();

        if (!fetchError && updatedPhoto) {
          console.log('Verified vote count after trigger:', updatedPhoto.vote_count);
        } else {
          console.error('Error verifying vote count:', fetchError);
        }
      }, 1000);
      
      console.log('Vote process completed successfully');
      toast({
        title: "Vote added",
        description: "Your vote has been recorded!",
        variant: "default"
      });
    } catch (error) {
      console.error('Error voting on photo:', error);
      toast({
        title: "Error",
        description: "Failed to vote. Please try again.",
        variant: "destructive"
      });
    } finally {
      setVotingStates(prev => ({ ...prev, [photoId]: false }));
    }
  };

  return {
    userVotes,
    votingStates,
    voteOnPhoto,
    hasVoted: (photoId: string) => userVotes.has(photoId)
  };
};
