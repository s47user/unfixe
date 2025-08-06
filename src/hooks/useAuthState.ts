import { useState, useEffect, useRef } from 'react';
import { supabase } from '../config/supabase';
import type { UserProfile, SupabaseUser } from '../config/supabase';


interface AuthState {
  user: SupabaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  refreshUserProfile: () => Promise<void>;
}

const RELOAD_DELAY_MS = 3000; // 3 seconds

export const useAuthState = (): AuthState => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const isMounted = useRef(true);
  const reloadTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const refreshUserProfile = async () => {
    if (user?.id) {
      if (isMounted.current) {
        setLoading(true);
      }
      await loadUserProfile(user.id);
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    isMounted.current = true;
    let authSubscription: any;

    const setupAuthListener = async () => {
      setLoading(true);

      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (isMounted.current) {
          if (session?.user) {
            setUser(session.user as SupabaseUser);
            await loadUserProfile(session.user.id);
          } else {
            setUser(null);
            setUserProfile(null);
          }
        }
      } catch (error) {
        console.error('useAuthState: Error getting initial session:', error);
        if (isMounted.current) {
          setUser(null);
          setUserProfile(null);
        }
      }

      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (!isMounted.current) return;

          setLoading(true);

          try {
            if (session?.user) {
              setUser(session.user as SupabaseUser);
              await loadUserProfile(session.user.id);
              // If a session is present, we are done loading for this event
              setLoading(false);
            } else {
              // If session is null (e.g., SIGNED_OUT, USER_DELETED)
              setUser(null);
              setUserProfile(null);

              // Only set loading to false if it's a definitive sign-out
              // and not a transient state before re-authentication.
              // For 'SIGNED_OUT' event, we keep loading true to wait for potential re-auth.
              if (event === 'SIGNED_OUT') {
                // Do NOT set setLoading(false) here.
              } else {
                // For other events where session is null (e.g., USER_DELETED),
                // it's a definitive end of session.
                setLoading(false);
              }
            }
          } catch (error) {
            console.error('useAuthState: Error handling auth state change:', error);
            setUser(null);
            setUserProfile(null);
            // On error, we should probably stop loading
            setLoading(false);
          }
        }
      );
      authSubscription = subscription;

      // After initial session and listener setup, set loading to false
      // This ensures the initial load is complete.
      // This should only happen if the initial session was null or if it was successfully retrieved.
      // If the initial session was null, and no SIGNED_IN event immediately followed,
      // then loading should be false.
    };

    setupAuthListener();

    return () => {
      isMounted.current = false;
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, []);

  // Effect to handle page reload on prolonged loading
  useEffect(() => {
    if (loading) {
      reloadTimeoutRef.current = setTimeout(() => {
        if (isMounted.current && loading) {
          window.location.reload();
        }
      }, RELOAD_DELAY_MS);
    } else {
      if (reloadTimeoutRef.current) {
        clearTimeout(reloadTimeoutRef.current);
        reloadTimeoutRef.current = null;
      }
    }

    return () => {
      if (reloadTimeoutRef.current) {
        clearTimeout(reloadTimeoutRef.current);
        reloadTimeoutRef.current = null;
      }
    };
  }, [loading]);

  const loadUserProfile = async (userId: string) => {
    try {
      // Attempt to fetch without .single() first to handle potential 406 issues
      const { data: profiles, error: fetchError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId);

      if (fetchError) {
        setUserProfile(null);
        return;
      }

      if (profiles && profiles.length > 0) {
        // Profile found
        setUserProfile(profiles[0]);
      } else {
        // Profile not found, attempt to create
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
          const { data: newProfile, error: insertError } = await supabase
            .from('user_profiles')
            .insert({
              id: authUser.id,
              email: authUser.email || '',
              full_name: authUser.user_metadata?.full_name || '',
              role: 'student' // Default role
            })
            .select('*')
            .single(); // Use single here as we expect one new profile

          if (insertError) {
            if (insertError.code === '23505') { // Unique violation, profile already exists (409 Conflict)
              // Try to fetch again, assuming it was created concurrently
              const { data: existingProfiles, error: refetchError } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('id', userId);
              if (refetchError || !existingProfiles || existingProfiles.length === 0) {
                setUserProfile(null);
              } else {
                setUserProfile(existingProfiles[0]);
              }
            } else {
              setUserProfile(null);
            }
          } else {
            setUserProfile(newProfile);
          }
        } else {
          setUserProfile(null); // No auth user to create profile
        }
      }
    } catch (error) {
      setUserProfile(null);
    }
  };

  return { user, userProfile, loading, refreshUserProfile };
};
