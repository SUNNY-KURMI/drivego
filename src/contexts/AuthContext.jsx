import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../utils/supabaseClient';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for active session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Sign up function
  const signUp = async (email, password, userData) => {
    return supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });
  };

  // Sign in function
  const signIn = async (email, password) => {
    return supabase.auth.signInWithPassword({
      email,
      password,
    });
  };

  // Google sign in
  const signInWithGoogle = async (redirectTo = '/') => {
    return supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}${redirectTo}`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
  };

  // Sign out function
  const signOut = async () => {
    return supabase.auth.signOut();
  };

  // Password reset
  const resetPassword = async (email) => {
    return supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
  };

  // Update password
  const updatePassword = async (newPassword) => {
    return supabase.auth.updateUser({
      password: newPassword,
    });
  };

  // Create or update user profile after OAuth sign in
  const createOrUpdateUserProfile = async (userData) => {
    if (!user) return null;

    try {
      // Check if the user already has a profile
      const { data: existingDriver, error: driverError } = await supabase
        .from('driver_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (driverError) {
        console.error('Error checking for driver profile:', driverError);
      }

      if (existingDriver) {
        // Update existing driver profile
        const { error } = await supabase
          .from('driver_profiles')
          .update({
            full_name: userData.full_name || user.user_metadata?.full_name || '',
            email: userData.email || user.email || '',
            phone_number: userData.phone_number || user.user_metadata?.phone || '',
            updated_at: new Date(),
          })
          .eq('user_id', user.id);
        
        if (error) console.error('Error updating driver profile:', error);
        return;
      }

      // Check for user profile
      const { data: existingUser, error: userError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('email', user.email)
        .maybeSingle();

      if (userError) {
        console.error('Error checking for user profile:', userError);
      }

      if (existingUser) {
        // Update existing user profile
        const { error } = await supabase
          .from('user_profiles')
          .update({
            full_name: userData.full_name || user.user_metadata?.full_name || '',
            phone: userData.phone || user.user_metadata?.phone || '',
            updated_at: new Date(),
          })
          .eq('id', existingUser.id);
        
        if (error) console.error('Error updating user profile:', error);
        return;
      }

      // Create new user profile if none exists
      const { error } = await supabase
        .from('user_profiles')
        .insert([
          {
            email: user.email,
            full_name: userData.full_name || user.user_metadata?.full_name || '',
            first_name: userData.first_name || user.user_metadata?.given_name || '',
            last_name: userData.last_name || user.user_metadata?.family_name || '',
            phone: userData.phone || user.user_metadata?.phone || '',
            is_driver: false,
            avatar_url: user.user_metadata?.avatar_url || '',
            created_at: new Date(),
            updated_at: new Date(),
          },
        ]);
      
      if (error) console.error('Error creating user profile:', error);
    } catch (error) {
      console.error('Error in createOrUpdateUserProfile:', error);
    }
  };

  // Get current user profile data from database
  const getUserProfile = async () => {
    if (!user) return null;

    try {
      // Try to get from driver_profiles first
      const { data: driverProfile, error: driverError } = await supabase
        .from('driver_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (driverError && driverError.code !== 'PGRST116') {
        console.error('Error fetching driver profile:', driverError);
      }

      if (driverProfile) return { ...driverProfile, isDriver: true };

      // If not a driver, try from user_profiles
      const { data: userProfile, error: userError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('email', user.email)
        .maybeSingle();

      if (userError && userError.code !== 'PGRST116') {
        console.error('Error fetching user profile:', userError);
      }

      if (userProfile) return { ...userProfile, isDriver: userProfile.is_driver || false };

      // If no profile exists yet but we have a user, create one from OAuth data
      if (user.app_metadata?.provider === 'google') {
        await createOrUpdateUserProfile({
          full_name: user.user_metadata?.full_name,
          first_name: user.user_metadata?.given_name,
          last_name: user.user_metadata?.family_name,
        });
        
        // Try again to get the newly created profile
        const { data: newProfile, error: newProfileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('email', user.email)
          .maybeSingle();
          
        if (newProfileError && newProfileError.code !== 'PGRST116') {
          console.error('Error fetching new profile:', newProfileError);
        }
        
        if (newProfile) return { ...newProfile, isDriver: newProfile.is_driver || false };
      }

      // If all else fails, return a default profile structure
      return {
        email: user.email,
        full_name: user.user_metadata?.full_name || '',
        isDriver: false,
      };
    } catch (error) {
      console.error('Error in getUserProfile:', error);
      // Return a default profile structure on error
      return {
        email: user?.email || '',
        isDriver: false,
      };
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    updatePassword,
    getUserProfile,
    createOrUpdateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext; 