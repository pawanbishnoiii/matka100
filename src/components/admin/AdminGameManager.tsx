
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Plus,
  Edit,
  Trash2,
  Play,
  Pause,
  Trophy,
  Clock,
  Target
} from 'lucide-react';

interface Game {
  id: string;
  name: string;
  opening_time: string;
  result_time: string;
  status: string;
  multipliers: any;
  is_active: boolean;
}

interface AdminGameManagerProps {
  onStatsUpdate: () => void;
}

export const AdminGameManager = ({ onStatsUpdate }: AdminGameManagerProps) => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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

  const handleSaveGame = async (gameData: any) => {
    try {
      const multipliers = {
        single_ank: Number(gameData.single_ank) || 10,
        jodi: Number(gameData.jodi) || 90,
        single_patti: Number(gameData.single_patti) || 140,
        double_patti: Number(gameData.double_patti) || 280,
        triple_patti: Number(gameData.triple_patti) || 600
      };

      if (selectedGame) {
        // Update existing game
        const { error } = await supabase
          .from('games')
          .update({
            name: gameData.name,
            opening_time: gameData.opening_time,
            result_time: gameData.result_time,
            status: gameData.status,
            multipliers,
            is_active: gameData.is_active
          })
          .eq('id', selectedGame.id);

        if (error) throw error;
        toast({
          title: 'Success',
          description: 'Game updated successfully',
        });
      } else {
        // Create new game
        const { error } = await supabase
          .from('games')
          .insert({
            name: gameData.name,
            opening_time: gameData.opening_time,
            result_time: gameData.result_time,
            status: gameData.status || 'active',
            multipliers,
            is_active: gameData.is_active ?? true
          });

        if (error) throw error;
        toast({
          title: 'Success',
          description: 'Game created successfully',
        });
      }

      fetchGames();
      onStatsUpdate();
      setIsDialogOpen(false);
      setSelectedGame(null);
    } catch (error) {
      console.error('Error saving game:', error);
      toast({
        title: 'Error',
        description: 'Failed to save game',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteGame = async (gameId: string) => {
    if (!confirm('Are you sure you want to delete this game?')) return;

    try {
      const { error } = await supabase
        .from('games')
        .delete()
        .eq('id', gameId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Game deleted successfully',
      });
      fetchGames();
      onStatsUpdate();
    } catch (error) {
      console.error('Error deleting game:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete game',
        variant: 'destructive',
      });
    }
  };

  const handleToggleGameStatus = async (game: Game) => {
    try {
      const { error } = await supabase
        .from('games')
        .update({ is_active: !game.is_active })
        .eq('id', game.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Game ${!game.is_active ? 'activated' : 'deactivated'} successfully`,
      });
      fetchGames();
      onStatsUpdate();
    } catch (error) {
      console.error('Error toggling game status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update game status',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <Card className="glass-card border-gray-700">
        <CardContent className="p-8 text-center">
          <div className="animate-pulse text-white">Loading games...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white hindi-font flex items-center gap-2">
          <Trophy className="w-6 h-6 text-blue-400" />
          Game Management System
        </CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => setSelectedGame(null)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Game
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card border-gray-700 text-white">
            <DialogHeader>
              <DialogTitle>
                {selectedGame ? 'Edit Game' : 'Create New Game'}
              </DialogTitle>
            </DialogHeader>
            <GameForm
              game={selectedGame}
              onSave={handleSaveGame}
              onCancel={() => {
                setIsDialogOpen(false);
                setSelectedGame(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {games.map((game) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-4 rounded-lg border border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{game.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Open: {game.opening_time}
                      </span>
                      <span className="flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        Result: {game.result_time}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    game.is_active
                      ? 'bg-green-600/20 text-green-400'
                      : 'bg-red-600/20 text-red-400'
                  }`}>
                    {game.is_active ? 'ACTIVE' : 'INACTIVE'}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleGameStatus(game)}
                      className="border-gray-600 text-white hover:bg-gray-700"
                    >
                      {game.is_active ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedGame(game);
                        setIsDialogOpen(true);
                      }}
                      className="border-gray-600 text-white hover:bg-gray-700"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteGame(game.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Multipliers Display */}
              <div className="mt-4 grid grid-cols-5 gap-2">
                <div className="text-center">
                  <p className="text-xs text-gray-400">Single Ank</p>
                  <p className="text-sm font-bold text-white">{game.multipliers?.single_ank || 10}x</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">Jodi</p>
                  <p className="text-sm font-bold text-white">{game.multipliers?.jodi || 90}x</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">Single Patti</p>
                  <p className="text-sm font-bold text-white">{game.multipliers?.single_patti || 140}x</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">Double Patti</p>
                  <p className="text-sm font-bold text-white">{game.multipliers?.double_patti || 280}x</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">Triple Patti</p>
                  <p className="text-sm font-bold text-white">{game.multipliers?.triple_patti || 600}x</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const GameForm = ({ game, onSave, onCancel }: any) => {
  const [formData, setFormData] = useState({
    name: game?.name || '',
    opening_time: game?.opening_time || '',
    result_time: game?.result_time || '',
    status: game?.status || 'active',
    is_active: game?.is_active ?? true,
    single_ank: game?.multipliers?.single_ank || 10,
    jodi: game?.multipliers?.jodi || 90,
    single_patti: game?.multipliers?.single_patti || 140,
    double_patti: game?.multipliers?.double_patti || 280,
    triple_patti: game?.multipliers?.triple_patti || 600
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Game Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="bg-gray-800 border-gray-600 text-white"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="opening_time">Opening Time</Label>
          <Input
            id="opening_time"
            type="time"
            value={formData.opening_time}
            onChange={(e) => setFormData({ ...formData, opening_time: e.target.value })}
            className="bg-gray-800 border-gray-600 text-white"
            required
          />
        </div>
        <div>
          <Label htmlFor="result_time">Result Time</Label>
          <Input
            id="result_time"
            type="time"
            value={formData.result_time}
            onChange={(e) => setFormData({ ...formData, result_time: e.target.value })}
            className="bg-gray-800 border-gray-600 text-white"
            required
          />
        </div>
      </div>

      <div>
        <Label>Multipliers</Label>
        <div className="grid grid-cols-5 gap-2 mt-2">
          <div>
            <Label htmlFor="single_ank" className="text-xs">Single Ank</Label>
            <Input
              id="single_ank"
              type="number"
              value={formData.single_ank}
              onChange={(e) => setFormData({ ...formData, single_ank: Number(e.target.value) })}
              className="bg-gray-800 border-gray-600 text-white"
            />
          </div>
          <div>
            <Label htmlFor="jodi" className="text-xs">Jodi</Label>
            <Input
              id="jodi"
              type="number"
              value={formData.jodi}
              onChange={(e) => setFormData({ ...formData, jodi: Number(e.target.value) })}
              className="bg-gray-800 border-gray-600 text-white"
            />
          </div>
          <div>
            <Label htmlFor="single_patti" className="text-xs">Single Patti</Label>
            <Input
              id="single_patti"
              type="number"
              value={formData.single_patti}
              onChange={(e) => setFormData({ ...formData, single_patti: Number(e.target.value) })}
              className="bg-gray-800 border-gray-600 text-white"
            />
          </div>
          <div>
            <Label htmlFor="double_patti" className="text-xs">Double Patti</Label>
            <Input
              id="double_patti"
              type="number"
              value={formData.double_patti}
              onChange={(e) => setFormData({ ...formData, double_patti: Number(e.target.value) })}
              className="bg-gray-800 border-gray-600 text-white"
            />
          </div>
          <div>
            <Label htmlFor="triple_patti" className="text-xs">Triple Patti</Label>
            <Input
              id="triple_patti"
              type="number"
              value={formData.triple_patti}
              onChange={(e) => setFormData({ ...formData, triple_patti: Number(e.target.value) })}
              className="bg-gray-800 border-gray-600 text-white"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          {game ? 'Update' : 'Create'} Game
        </Button>
      </div>
    </form>
  );
};
