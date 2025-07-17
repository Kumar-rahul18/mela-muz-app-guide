
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

        if (error) throw error;

        const votedPhotoIds = new Set(data?.map(vote => vote.photo_id) || []);
        setUserVotes(votedPhotoIds);
      } catch (error) {
        console.error('Error loading user votes:', error);
      }
    };

    loadUserVotes();
  }, []);

  const toggleVote = async (photoId: string) => {
    const userIdentifier = getUserIdentifier();
    const hasVoted = userVotes.has(photoId);

    // Prevent multiple simultaneous votes on the same photo
    if (votingStates[photoId]) return;

    setVotingStates(prev => ({ ...prev, [photoId]: true }));

    try {
      if (hasVoted) {
        // Remove vote
        const { error } = await supabase
          .from('photo_votes')
          .delete()
          .eq('photo_id', photoId)
          .eq('user_identifier', userIdentifier);

        if (error) throw error;

        setUserVotes(prev => {
          const newSet = new Set(prev);
          newSet.delete(photoId);
          return newSet;
        });
      } else {
        // Add vote
        const { error } = await supabase
          .from('photo_votes')
          .insert([{
            photo_id: photoId,
            user_identifier: userIdentifier,
            vote_type: 'like'
          }]);

        if (error) throw error;

        setUserVotes(prev => new Set([...prev, photoId]));
      }
    } catch (error) {
      console.error('Error toggling vote:', error);
      toast({
        title: "Error",
        description: "Failed to update vote. Please try again.",
        variant: "destructive"
      });
    } finally {
      setVotingStates(prev => ({ ...prev, [photoId]: false }));
    }
  };

  return {
    userVotes,
    votingStates,
    toggleVote,
    hasVoted: (photoId: string) => userVotes.has(photoId)
  };
};
