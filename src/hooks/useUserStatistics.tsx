
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
        
        // Fetch user bets to calculate statistics
        const { data: bets, error: betsError } = await supabase
          .from('bets')
          .select('*')
          .eq('user_id', user.id);

        if (betsError) {
          console.error('Error fetching bets:', betsError);
          throw betsError;
        }

        console.log('Found bets:', bets);

        if (bets && bets.length > 0) {
          const totalBets = bets.length;
          const totalWins = bets.filter(bet => bet.is_winner).length;
          const totalAmountBet = bets.reduce((sum, bet) => sum + bet.amount_inr, 0);
          const totalAmountWon = bets.reduce((sum, bet) => sum + (bet.actual_win || 0), 0);
          const winPercentage = totalBets > 0 ? (totalWins / totalBets) * 100 : 0;
          
          // Find most played game
          const gameCounts: { [key: string]: number } = {};
          bets.forEach(bet => {
            if (bet.game_id) {
              gameCounts[bet.game_id] = (gameCounts[bet.game_id] || 0) + 1;
            }
          });
          
          const favoriteGameId = Object.keys(gameCounts).reduce((a, b) => 
            gameCounts[a] > gameCounts[b] ? a : b, Object.keys(gameCounts)[0] || ''
          );

          // Get game name for favorite game
          let favoriteGameName = 'None';
          if (favoriteGameId) {
            const { data: gameData } = await supabase
              .from('games')
              .select('name')
              .eq('id', favoriteGameId)
              .single();
            
            if (gameData) {
              favoriteGameName = gameData.name;
            }
          }

          const lastBetDate = bets.reduce((latest, bet) => {
            const betDate = new Date(bet.bet_date || bet.created_at);
            return betDate > latest ? betDate : latest;
          }, new Date(0));

          setStatistics({
            total_bets: totalBets,
            total_wins: totalWins,
            total_amount_bet: totalAmountBet,
            total_amount_won: totalAmountWon,
            win_percentage: winPercentage,
            favorite_game: favoriteGameName,
            last_bet_date: lastBetDate.toISOString().split('T')[0]
          });
        } else {
          // No bets found, set default statistics
          setStatistics({
            total_bets: 0,
            total_wins: 0,
            total_amount_bet: 0,
            total_amount_won: 0,
            win_percentage: 0,
            favorite_game: 'None',
            last_bet_date: 'Never'
          });
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
    setLoading(true);
    
    // Re-run the fetch logic
    try {
      const { data: bets, error: betsError } = await supabase
        .from('bets')
        .select('*')
        .eq('user_id', user.id);

      if (betsError) throw betsError;

      if (bets && bets.length > 0) {
        const totalBets = bets.length;
        const totalWins = bets.filter(bet => bet.is_winner).length;
        const totalAmountBet = bets.reduce((sum, bet) => sum + bet.amount_inr, 0);
        const totalAmountWon = bets.reduce((sum, bet) => sum + (bet.actual_win || 0), 0);
        const winPercentage = totalBets > 0 ? (totalWins / totalBets) * 100 : 0;
        
        const gameCounts: { [key: string]: number } = {};
        bets.forEach(bet => {
          if (bet.game_id) {
            gameCounts[bet.game_id] = (gameCounts[bet.game_id] || 0) + 1;
          }
        });
        
        const favoriteGameId = Object.keys(gameCounts).reduce((a, b) => 
          gameCounts[a] > gameCounts[b] ? a : b, Object.keys(gameCounts)[0] || ''
        );

        let favoriteGameName = 'None';
        if (favoriteGameId) {
          const { data: gameData } = await supabase
            .from('games')
            .select('name')
            .eq('id', favoriteGameId)
            .single();
          
          if (gameData) {
            favoriteGameName = gameData.name;
          }
        }

        const lastBetDate = bets.reduce((latest, bet) => {
          const betDate = new Date(bet.bet_date || bet.created_at);
          return betDate > latest ? betDate : latest;
        }, new Date(0));

        setStatistics({
          total_bets: totalBets,
          total_wins: totalWins,
          total_amount_bet: totalAmountBet,
          total_amount_won: totalAmountWon,
          win_percentage: winPercentage,
          favorite_game: favoriteGameName,
          last_bet_date: lastBetDate.toISOString().split('T')[0]
        });
      }
    } catch (err) {
      console.error('Error refreshing statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    statistics,
    loading,
    error,
    refreshStatistics
  };
};
