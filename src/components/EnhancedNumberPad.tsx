
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, ShoppingCart } from 'lucide-react';

interface EnhancedNumberPadProps {
  gameId: string;
  onCartUpdate?: () => void;
}

type BetType = 'single_ank' | 'jodi' | 'single_patti' | 'double_patti' | 'triple_patti';

const multipliers = {
  single_ank: 10,
  jodi: 90,
  single_patti: 140,
  double_patti: 280,
  triple_patti: 600,
};

export const EnhancedNumberPad = ({ gameId, onCartUpdate }: EnhancedNumberPadProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [betAmount, setBetAmount] = useState('');
  const [betType, setBetType] = useState<BetType>('single_ank');
  const [addingToCart, setAddingToCart] = useState(false);

  const numbers = Array.from({ length: 100 }, (_, i) => i);

  const calculatePotentialWin = (amount: number, type: BetType) => {
    return amount * multipliers[type];
  };

  const addToCart = async () => {
    if (!user || selectedNumber === null || !betAmount || parseFloat(betAmount) <= 0) {
      toast({
        title: 'Invalid Input',
        description: 'Please select a number and enter a valid bet amount',
        variant: 'destructive',
      });
      return;
    }

    try {
      setAddingToCart(true);
      const amount = parseFloat(betAmount);
      const potentialWin = calculatePotentialWin(amount, betType);

      const { error } = await supabase
        .from('bet_cart')
        .insert({
          user_id: user.id,
          game_id: gameId,
          number: selectedNumber,
          bet_type: betType,
          amount_inr: amount,
          potential_win: potentialWin,
        });

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: 'Already in Cart',
            description: `This bet combination is already in your cart`,
            variant: 'destructive',
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: 'Added to Cart! 🛒',
          description: `₹${amount} bet on ${selectedNumber} (${betType.replace('_', ' ')})`,
        });

        // Reset form
        setSelectedNumber(null);
        setBetAmount('');
        setBetType('single_ank');

        if (onCartUpdate) {
          onCartUpdate();
        }
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: 'Error',
        description: 'Failed to add bet to cart',
        variant: 'destructive',
      });
    } finally {
      setAddingToCart(false);
    }
  };

  const potentialWin = betAmount ? calculatePotentialWin(parseFloat(betAmount) || 0, betType) : 0;

  return (
    <div className="space-y-6">
      {/* Number Grid */}
      <div>
        <Label className="text-gray-300 mb-4 block">Select Number</Label>
        <div className="grid grid-cols-10 gap-2 max-h-96 overflow-y-auto p-2 bg-gray-800/30 rounded-lg">
          {numbers.map((number) => (
            <Button
              key={number}
              variant={selectedNumber === number ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedNumber(number)}
              className={`aspect-square text-xs ${
                selectedNumber === number
                  ? 'bg-yellow-500 text-black hover:bg-yellow-600'
                  : 'border-gray-600 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {number.toString().padStart(2, '0')}
            </Button>
          ))}
        </div>
      </div>

      {/* Selected Number Display */}
      {selectedNumber !== null && (
        <div className="text-center">
          <p className="text-gray-400 text-sm">Selected Number</p>
          <Badge className="bg-yellow-500 text-black font-bold text-lg px-4 py-2">
            {selectedNumber.toString().padStart(2, '0')}
          </Badge>
        </div>
      )}

      {/* Bet Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Bet Type */}
        <div>
          <Label className="text-gray-300">Bet Type</Label>
          <Select value={betType} onValueChange={(value: BetType) => setBetType(value)}>
            <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single_ank">Single Ank (1:10)</SelectItem>
              <SelectItem value="jodi">Jodi (1:90)</SelectItem>
              <SelectItem value="single_patti">Single Patti (1:140)</SelectItem>
              <SelectItem value="double_patti">Double Patti (1:280)</SelectItem>
              <SelectItem value="triple_patti">Triple Patti (1:600)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bet Amount */}
        <div>
          <Label className="text-gray-300">Bet Amount (₹)</Label>
          <Input
            type="number"
            placeholder="Enter amount"
            value={betAmount}
            onChange={(e) => setBetAmount(e.target.value)}
            className="bg-gray-800 border-gray-600 text-white"
            min="1"
          />
        </div>
      </div>

      {/* Potential Win Display */}
      {betAmount && potentialWin > 0 && (
        <div className="bg-green-900/20 border border-green-600/50 rounded-lg p-4 text-center">
          <p className="text-green-400 text-sm">Potential Win</p>
          <p className="text-green-400 text-2xl font-bold">₹{potentialWin}</p>
          <p className="text-gray-400 text-xs">
            {multipliers[betType]}x multiplier on ₹{betAmount}
          </p>
        </div>
      )}

      {/* Add to Cart Button */}
      <Button
        onClick={addToCart}
        disabled={addingToCart || selectedNumber === null || !betAmount}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        size="lg"
      >
        {addingToCart ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Adding...
          </>
        ) : (
          <>
            <ShoppingCart className="w-5 h-5 mr-2" />
            Add to Cart
          </>
        )}
      </Button>

      {/* Quick Amount Buttons */}
      <div className="grid grid-cols-4 gap-2">
        {[10, 50, 100, 500].map((amount) => (
          <Button
            key={amount}
            variant="outline"
            size="sm"
            onClick={() => setBetAmount(amount.toString())}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            ₹{amount}
          </Button>
        ))}
      </div>
    </div>
  );
};
