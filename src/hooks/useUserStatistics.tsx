
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface UserStatistics {
  total_bets: number;
  total_wins: number;
  total_amount_bet: number;
  total_amount_won: number;
  win_percentage: number;
  favorite_game: string;
  last_bet_date: string;
}

export const useUserStatistics = () => {
  const [statistics, setStatistics] = useState<UserStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserStatistics = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching user statistics for user:', user.id);
        
        // First try to get existing statistics
        const { data: existingStats, error: statsError } = await supabase
          .from('user_statistics')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (statsError && statsError.code !== 'PGRST116') {
          console.error('Error fetching statistics:', statsError);
          throw statsError;
        }

        if (existingStats) {
          console.log('Found existing statistics:', existingStats);
          setStatistics(existingStats);
        } else {
          console.log('No existing statistics found, creating initial entry');
          // Create initial statistics entry if none exists
          const { data: newStats, error: insertError } = await supabase
            .from('user_statistics')
            .insert({
              user_id: user.id,
              total_bets: 0,
              total_wins: 0,
              total_amount_bet: 0,
              total_amount_won: 0,
              win_percentage: 0,
              favorite_game: null,
              last_bet_date: null
            })
            .select()
            .single();

          if (insertError) {
            console.error('Error creating statistics:', insertError);
            throw insertError;
          }

          console.log('Created new statistics:', newStats);
          setStatistics(newStats);
        }
      } catch (err) {
        console.error('Error in fetchUserStatistics:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchUserStatistics();
  }, [user]);

  const refreshStatistics = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_statistics')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setStatistics(data);
    } catch (err) {
      console.error('Error refreshing statistics:', err);
    }
  };

  return {
    statistics,
    loading,
    error,
    refreshStatistics
  };
};
