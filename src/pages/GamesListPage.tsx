
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, GamepadIcon, Clock, Trophy, Calendar } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Game {
  id: string;
  name: string;
  opening_time: string;
  closing_time?: string;
  result_time?: string;
  status: string;
  is_active: boolean;
  created_at: string;
}

const GamesListPage = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .order('opening_time');

      if (error) throw error;
      setGames(data || []);
    } catch (error) {
      console.error('Error fetching games:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch games',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return 'Not Set';
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getStatusColor = (status: string, isActive: boolean) => {
    if (!isActive) return 'bg-gray-600/20 text-gray-400';
    
    switch (status) {
      case 'active':
        return 'bg-green-600/20 text-green-400';
      case 'upcoming':
        return 'bg-blue-600/20 text-blue-400';
      case 'closed':
        return 'bg-red-600/20 text-red-400';
      default:
        return 'bg-gray-600/20 text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded mb-8"></div>
            <div className="grid gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-card border-b border-gray-700/50 p-4 mb-6"
      >
        <div className="container mx-auto flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white hindi-font">Games List</h1>
            <p className="text-sm text-gray-400">All available games</p>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4">
        {games.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <GamepadIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">No Games Available</h2>
            <p className="text-gray-400">Games will appear here once they are created by admin</p>
          </motion.div>
        ) : (
          <div className="grid gap-6 max-w-4xl mx-auto">
            {games.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass-card border-gray-700 hover:neon-blue-glow transition-all cursor-pointer"
                      onClick={() => navigate(`/game/${game.id}`)}>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white hindi-font flex items-center gap-2">
                        <GamepadIcon className="w-6 h-6 text-yellow-400" />
                        {game.name}
                      </CardTitle>
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(game.status, game.is_active)}`}>
                        {game.is_active ? game.status.toUpperCase() : 'INACTIVE'}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2 text-green-400">
                        <Clock className="w-4 h-4" />
                        <div>
                          <p className="text-xs text-gray-400">Opening</p>
                          <p className="font-semibold">{formatTime(game.opening_time)}</p>
                        </div>
                      </div>
                      
                      {game.closing_time && (
                        <div className="flex items-center gap-2 text-red-400">
                          <Clock className="w-4 h-4" />
                          <div>
                            <p className="text-xs text-gray-400">Closing</p>
                            <p className="font-semibold">{formatTime(game.closing_time)}</p>
                          </div>
                        </div>
                      )}
                      
                      {game.result_time && (
                        <div className="flex items-center gap-2 text-purple-400">
                          <Trophy className="w-4 h-4" />
                          <div>
                            <p className="text-xs text-gray-400">Result</p>
                            <p className="font-semibold">{formatTime(game.result_time)}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">
                          Created: {new Date(game.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <Button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/game/${game.id}`);
                        }}
                        className="neon-glow bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
                        disabled={!game.is_active}
                      >
                        {game.is_active ? 'Play Game' : 'Game Closed'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Padding for Mobile Navigation */}
      <div className="h-20 md:h-0"></div>
    </div>
  );
};

export default GamesListPage;
