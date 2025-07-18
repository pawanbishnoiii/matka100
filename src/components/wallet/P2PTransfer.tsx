
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Copy, Check, ArrowRight, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface P2PTransferProps {
  onSuccess?: () => void;
}

const P2PTransfer = ({ onSuccess }: P2PTransferProps = {}) => {
  const [transferData, setTransferData] = useState({
    receiverUUI: '',
    amount: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const [userUUI, setUserUUI] = useState('');

  // Fetch user's UUI ID
  useState(() => {
    const fetchUserUUI = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('users')
          .select('uui_id')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setUserUUI(data.uui_id || '');
      } catch (error) {
        console.error('Error fetching UUI:', error);
      }
    };

    fetchUserUUI();
  });

  const copyUUI = () => {
    navigator.clipboard.writeText(userUUI);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: 'Copied',
      description: 'Your UUI ID copied to clipboard',
    });
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!transferData.receiverUUI || !transferData.amount) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    if (transferData.receiverUUI === userUUI) {
      toast({
        title: 'Error',
        description: 'Cannot transfer to yourself',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      // First check if receiver exists
      const { data: receiver, error: receiverError } = await supabase
        .from('users')
        .select('id, name, uui_id')
        .eq('uui_id', transferData.receiverUUI)
        .single();

      if (receiverError || !receiver) {
        throw new Error('Receiver not found');
      }

      // Check sender balance
      const { data: sender, error: senderError } = await supabase
        .from('users')
        .select('balance_inr')
        .eq('id', user.id)
        .single();

      if (senderError) throw senderError;

      const amount = parseFloat(transferData.amount);
      if (sender.balance_inr < amount) {
        throw new Error('Insufficient balance');
      }

      // Create transfer record
      const { error: transferError } = await supabase
        .from('p2p_transfers')
        .insert({
          sender_id: user.id,
          receiver_id: receiver.id,
          receiver_uui: transferData.receiverUUI,
          amount: amount,
          description: transferData.description || 'P2P Transfer',
          status: 'completed'
        });

      if (transferError) throw transferError;

      // Update balances
      await supabase.rpc('update_user_balance', {
        user_uuid: user.id,
        amount: -amount
      });

      await supabase.rpc('update_user_balance', {
        user_uuid: receiver.id,
        amount: amount
      });

      // Create transaction records
      await supabase.from('transactions').insert([
        {
          user_id: user.id,
          type: 'withdrawal',
          amount: amount,
          status: 'completed',
          description: `P2P Transfer to ${receiver.name || transferData.receiverUUI}`
        },
        {
          user_id: receiver.id,
          type: 'deposit',
          amount: amount,
          status: 'completed',
          description: `P2P Transfer from ${user.email}`
        }
      ]);

      toast({
        title: 'Success',
        description: `₹${amount} transferred successfully to ${receiver.name || transferData.receiverUUI}`,
      });

      // Call onSuccess callback
      onSuccess?.();

      setTransferData({ receiverUUI: '', amount: '', description: '' });
    } catch (error: any) {
      console.error('Transfer error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Transfer failed',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="glass-card border-gray-700">
      <CardHeader>
        <CardTitle className="text-white hindi-font flex items-center gap-2">
          <Send className="w-5 h-5 text-blue-400" />
          P2P Transfer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* User's UUI Display */}
        <div className="p-4 bg-blue-600/20 rounded-lg border border-blue-600/30">
          <Label className="text-blue-400 font-semibold">Your UUI ID</Label>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex-1 p-2 bg-gray-800 rounded font-mono text-sm text-white">
              {userUUI || 'Loading...'}
            </div>
            <Button
              onClick={copyUUI}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Share this UUI ID with others to receive transfers
          </p>
        </div>

        {/* Transfer Form */}
        <form onSubmit={handleTransfer} className="space-y-4">
          <div>
            <Label className="text-white">Receiver UUI ID</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                value={transferData.receiverUUI}
                onChange={(e) => setTransferData({ ...transferData, receiverUUI: e.target.value.toUpperCase() })}
                className="pl-10 bg-gray-800/50 border-gray-600 text-white font-mono"
                placeholder="Enter receiver's UUI ID"
                required
              />
            </div>
          </div>

          <div>
            <Label className="text-white">Amount (₹)</Label>
            <Input
              type="number"
              step="0.01"
              min="1"
              value={transferData.amount}
              onChange={(e) => setTransferData({ ...transferData, amount: e.target.value })}
              className="bg-gray-800/50 border-gray-600 text-white"
              placeholder="Enter amount to transfer"
              required
            />
          </div>

          <div>
            <Label className="text-white">Description (Optional)</Label>
            <Input
              type="text"
              value={transferData.description}
              onChange={(e) => setTransferData({ ...transferData, description: e.target.value })}
              className="bg-gray-800/50 border-gray-600 text-white"
              placeholder="Add a note for this transfer"
            />
          </div>

          <Button 
            type="submit"
            disabled={loading}
            className="w-full neon-glow bg-gradient-to-r from-blue-600 to-purple-600"
          >
            <ArrowRight className="w-4 h-4 mr-2" />
            {loading ? 'Processing...' : 'Send Money'}
          </Button>
        </form>

        <div className="p-4 bg-yellow-600/20 rounded-lg border border-yellow-600/30">
          <h4 className="text-yellow-400 font-semibold mb-2">Important:</h4>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Double-check the receiver's UUI ID before sending</li>
            <li>• Transfers are instant and cannot be reversed</li>
            <li>• Minimum transfer amount is ₹1</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default P2PTransfer;
