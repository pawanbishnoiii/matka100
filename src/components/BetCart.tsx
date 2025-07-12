
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, ShoppingCart, Plus } from 'lucide-react';

interface BetCartItem {
  id: string;
  number: number;
  bet_type: 'single_ank' | 'jodi' | 'single_patti' | 'double_patti' | 'triple_patti';
  amount_inr: number;
  potential_win: number;
}

interface BetCartProps {
  gameId: string;
  onBetPlaced?: () => void;
}

export const BetCart = ({ gameId, onBetPlaced }: BetCartProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [cartItems, setCartItems] = useState<BetCartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [placingBets, setPlacingBets] = useState(false);

  useEffect(() => {
    if (user && gameId) {
      fetchCartItems();
    }
  }, [user, gameId]);

  const fetchCartItems = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bet_cart')
        .select('*')
        .eq('user_id', user.id)
        .eq('game_id', gameId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCartItems(data || []);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch cart items',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('bet_cart')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      setCartItems(items => items.filter(item => item.id !== itemId));
      toast({
        title: 'Success',
        description: 'Item removed from cart',
      });
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove item from cart',
        variant: 'destructive',
      });
    }
  };

  const placeAllBets = async () => {
    if (!user || cartItems.length === 0) return;

    try {
      setPlacingBets(true);

      // Convert cart items to bet format with proper typing
      const betsToPlace = cartItems.map(item => ({
        user_id: user.id,
        game_id: gameId,
        numbers: [item.number],
        bet_type: item.bet_type as 'single_ank' | 'jodi' | 'single_patti' | 'double_patti' | 'triple_patti',
        amount_inr: item.amount_inr,
        potential_win: item.potential_win,
      }));

      // Place all bets
      const { error: betsError } = await supabase
        .from('bets')
        .insert(betsToPlace);

      if (betsError) throw betsError;

      // Clear cart after successful bet placement
      const { error: clearError } = await supabase
        .from('bet_cart')
        .delete()
        .eq('user_id', user.id)
        .eq('game_id', gameId);

      if (clearError) throw clearError;

      setCartItems([]);
      toast({
        title: 'Success! 🎯',
        description: `Successfully placed ${betsToPlace.length} bets!`,
      });

      if (onBetPlaced) {
        onBetPlaced();
      }
    } catch (error) {
      console.error('Error placing bets:', error);
      toast({
        title: 'Error',
        description: 'Failed to place bets',
        variant: 'destructive',
      });
    } finally {
      setPlacingBets(false);
    }
  };

  const clearCart = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('bet_cart')
        .delete()
        .eq('user_id', user.id)
        .eq('game_id', gameId);

      if (error) throw error;

      setCartItems([]);
      toast({
        title: 'Success',
        description: 'Cart cleared',
      });
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast({
        title: 'Error',
        description: 'Failed to clear cart',
        variant: 'destructive',
      });
    }
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + item.amount_inr, 0);
  const totalPotentialWin = cartItems.reduce((sum, item) => sum + item.potential_win, 0);

  if (loading) {
    return (
      <Card className="glass-card border-gray-700">
        <CardContent className="p-6">
          <div className="animate-pulse text-center text-gray-400">Loading cart...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <ShoppingCart className="w-5 h-5" />
          Bet Cart ({cartItems.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {cartItems.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Your cart is empty</p>
            <p className="text-sm">Add some bets to get started</p>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between bg-gray-800/50 p-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-yellow-500 text-black font-bold">
                      {item.number}
                    </Badge>
                    <div>
                      <p className="text-white text-sm font-medium">
                        {item.bet_type.replace('_', ' ').toUpperCase()}
                      </p>
                      <p className="text-gray-400 text-xs">
                        ₹{item.amount_inr} → ₹{item.potential_win}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="border-t border-gray-700 pt-4 space-y-2">
              <div className="flex justify-between text-gray-300">
                <span>Total Bet Amount:</span>
                <span className="font-bold">₹{totalAmount}</span>
              </div>
              <div className="flex justify-between text-green-400">
                <span>Potential Win:</span>
                <span className="font-bold">₹{totalPotentialWin}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <Button
                onClick={placeAllBets}
                disabled={placingBets}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                {placingBets ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Placing...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Place All Bets
                  </>
                )}
              </Button>
              <Button
                onClick={clearCart}
                variant="outline"
                className="border-red-600 text-red-400 hover:bg-red-900/20"
              >
                Clear Cart
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
