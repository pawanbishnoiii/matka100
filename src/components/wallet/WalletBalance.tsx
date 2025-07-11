
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  IndianRupee,
  PoundSterling,
  ToggleLeft, 
  ToggleRight,
  Wallet
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface WalletBalanceProps {
  currency: 'INR' | 'GBP';
  onCurrencyChange: (currency: 'INR' | 'GBP') => void;
}

const WalletBalance = ({ currency, onCurrencyChange }: WalletBalanceProps) => {
  const [balanceINR, setBalanceINR] = useState(0);
  const [balanceGBP, setBalanceGBP] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Mock exchange rate - in production, this would come from settings
  const exchangeRate = 0.012; // 1 INR = 0.012 GBP

  useEffect(() => {
    if (user) {
      fetchBalance();
    }
  }, [user]);

  const fetchBalance = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('users')
        .select('balance_inr, balance_gbp')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setBalanceINR(data.balance_inr || 0);
      setBalanceGBP(data.balance_gbp || 0);
    } catch (error) {
      console.error('Error fetching balance:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDisplayBalance = () => {
    if (currency === 'GBP') {
      return balanceGBP.toFixed(2);
    }
    return balanceINR.toLocaleString();
  };

  const getConvertedBalance = () => {
    if (currency === 'INR') {
      return `≈ £${(balanceINR * exchangeRate).toFixed(2)}`;
    }
    return `≈ ₹${(balanceGBP / exchangeRate).toLocaleString()}`;
  };

  if (loading) {
    return (
      <Card className="glass-card border-gray-700 neon-blue-glow">
        <CardContent className="p-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-700 rounded mb-4"></div>
              <div className="h-12 bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-700 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
    >
      <Card className="glass-card border-gray-700 neon-blue-glow">
        <CardContent className="p-8">
          <div className="text-center">
            {/* Currency Toggle */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <IndianRupee className={`w-5 h-5 ${currency === 'INR' ? 'text-orange-500' : 'text-gray-500'}`} />
              <button
                onClick={() => onCurrencyChange(currency === 'INR' ? 'GBP' : 'INR')}
                className="flex items-center gap-2"
              >
                {currency === 'INR' ? (
                  <ToggleLeft className="w-8 h-8 text-orange-500" />
                ) : (
                  <ToggleRight className="w-8 h-8 text-blue-500" />
                )}
              </button>
              <PoundSterling className={`w-5 h-5 ${currency === 'GBP' ? 'text-blue-500' : 'text-gray-500'}`} />
            </div>

            <p className="text-gray-400 mb-2">Available Balance</p>
            <p className="text-5xl font-bold text-white mb-2">
              {currency === 'INR' ? '₹' : '£'}{getDisplayBalance()}
            </p>
            <p className="text-sm text-gray-400">
              {getConvertedBalance()}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default WalletBalance;
