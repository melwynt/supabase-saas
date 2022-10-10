import { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../utils/supabase';
import { useRouter } from 'next/router';
import axios from 'axios';

const Context = createContext();

const Provider = ({ children }) => {
  const [user, setUser] = useState(supabase.auth.user());
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    console.log('calling useEffect');

    const getUserProfile = async () => {
      const sessionUser = supabase.auth.user();

      if (sessionUser) {
        const { data: profile } = await supabase
          .from('profile')
          .select('*')
          .eq('id', sessionUser.id)
          .single();

        setUser({
          ...sessionUser,
          ...profile,
        });
      }
    };

    getUserProfile().then(() => {
      setIsLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      // setUser(supabase.auth.user());
      getUserProfile();
    });

    // cleanup function to unsubscribe
    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    axios.post('/api/set-supabase-cookie', {
      event: user ? 'SIGNED_IN' : 'SIGNED_OUT',
      session: supabase.auth.session(),
    });
  }, [user]);

  useEffect(() => {
    if (user) {
      console.log('subscription');
      const subscription = supabase
        .from(`profile:id=eq.${user.id}`)
        .on('UPDATE', (payload) => {
          console.log('payload is:', payload);
          console.log('user is:', user);
          setUser({ ...user, ...payload.new });
        })
        .subscribe();

      return () => {
        supabase.removeSubscription(subscription);
      };
    }
  }, [user]);

  const login = async () => {
    console.log('calling login');
    await supabase.auth.signIn({
      provider: 'github',
    });
  };

  const logout = async () => {
    console.log('calling logout');
    await supabase.auth.signOut();
    setUser(null);
    router.push('/');
  };

  const exposed = {
    user,
    login,
    logout,
    isLoading,
  };

  return <Context.Provider value={exposed}>{children}</Context.Provider>;
};

export const useUser = () => useContext(Context);

export default Provider;
