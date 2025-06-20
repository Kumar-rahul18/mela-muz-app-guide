
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [email, setEmail] = useState('harsh171517@gmail.com');
  const [password, setPassword] = useState('Xy91%7as');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // First, try to sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // If user doesn't exist, try to create the account
        if (error.message.includes('Invalid login credentials')) {
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
          });

          if (signUpError) {
            toast.error('Failed to create admin account: ' + signUpError.message);
            return;
          }

          if (signUpData.user) {
            // Try to add admin user record
            try {
              await supabase
                .from('admin_users')
                .insert({
                  user_id: signUpData.user.id,
                  is_active: true
                });
            } catch (adminError) {
              console.log('Admin user record creation failed, but continuing...');
            }

            toast.success('Admin account created and logged in successfully!');
            navigate('/admin/dashboard');
            return;
          }
        } else {
          toast.error('Login failed: ' + error.message);
          return;
        }
      }

      if (data.user) {
        // Check if user is admin by email or database record
        const isAdminEmail = data.user.email === 'harsh171517@gmail.com';
        
        if (!isAdminEmail) {
          const { data: adminData, error: adminError } = await supabase
            .from('admin_users')
            .select('*')
            .eq('user_id', data.user.id)
            .eq('is_active', true)
            .single();

          if (adminError || !adminData) {
            toast.error('Access denied. Admin privileges required.');
            await supabase.auth.signOut();
            return;
          }
        }

        toast.success('Login successful!');
        navigate('/admin/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-red-50 to-pink-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 via-red-500 to-pink-600 text-white px-4 py-3 shadow-lg">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => navigate('/')} 
            className="text-white font-bold text-xl bg-white/20 rounded-lg px-3 py-1 hover:bg-white/30 transition-colors"
          >
            ← 
          </button>
          <h1 className="text-lg font-semibold">Admin Login</h1>
        </div>
      </div>

      <div className="px-4 py-8">
        <div className="max-w-md mx-auto bg-white rounded-2xl p-6 shadow-lg border border-orange-200">
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-orange-100 to-red-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🔐</span>
            </div>
            <h2 className="text-xl font-bold text-orange-800">Admin Access</h2>
            <p className="text-orange-600 text-sm mt-2">Sign in to access admin dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-orange-700">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 border-orange-200 focus:border-orange-400"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-orange-700">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 border-orange-200 focus:border-orange-400"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
