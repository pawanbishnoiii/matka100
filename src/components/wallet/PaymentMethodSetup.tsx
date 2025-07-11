
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Smartphone, 
  Building, 
  Bitcoin, 
  Save, 
  Eye, 
  EyeOff,
  Copy,
  Check
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const PaymentMethodSetup = () => {
  const [activeTab, setActiveTab] = useState<'upi' | 'bank' | 'usdt'>('upi');
  const [showSensitive, setShowSensitive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const [paymentData, setPaymentData] = useState({
    upi_id: '',
    bank_account: {
      account_holder_name: '',
      account_number: '',
      ifsc_code: '',
      bank_name: ''
    },
    usdt_address: ''
  });

  const handleSave = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const updateData: any = {};
      
      if (activeTab === 'upi') {
        updateData.upi_id = paymentData.upi_id;
      } else if (activeTab === 'bank') {
        updateData.bank_account = paymentData.bank_account;
      } else if (activeTab === 'usdt') {
        updateData.usdt_address = paymentData.usdt_address;
      }

      const { error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Payment method saved successfully',
      });
    } catch (error) {
      console.error('Error saving payment method:', error);
      toast({
        title: 'Error',
        description: 'Failed to save payment method',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: 'Copied',
      description: 'Address copied to clipboard',
    });
  };

  const tabs = [
    { id: 'upi', label: 'UPI', icon: Smartphone, color: 'blue' },
    { id: 'bank', label: 'Bank Account', icon: Building, color: 'green' },
    { id: 'usdt', label: 'USDT TRC-20', icon: Bitcoin, color: 'orange' }
  ];

  return (
    <Card className="glass-card border-gray-700">
      <CardHeader>
        <CardTitle className="text-white hindi-font">Payment Method Setup</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 ${
                activeTab === tab.id 
                  ? `neon-${tab.color}-glow bg-gradient-to-r from-${tab.color}-600 to-${tab.color}-700` 
                  : 'glass-card hover:bg-gray-700/50'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* UPI Setup */}
        {activeTab === 'upi' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div>
              <Label className="text-white">UPI ID</Label>
              <div className="relative">
                <Input
                  type="text"
                  value={paymentData.upi_id}
                  onChange={(e) => setPaymentData({ ...paymentData, upi_id: e.target.value })}
                  className="bg-gray-800/50 border-gray-600 text-white"
                  placeholder="Enter your UPI ID (e.g., username@paytm)"
                />
              </div>
              <p className="text-sm text-gray-400 mt-1">
                This UPI ID will be used for withdrawals
              </p>
            </div>
          </motion.div>
        )}

        {/* Bank Account Setup */}
        {activeTab === 'bank' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div>
              <Label className="text-white">Account Holder Name</Label>
              <Input
                type="text"
                value={paymentData.bank_account.account_holder_name}
                onChange={(e) => setPaymentData({ 
                  ...paymentData, 
                  bank_account: { ...paymentData.bank_account, account_holder_name: e.target.value }
                })}
                className="bg-gray-800/50 border-gray-600 text-white"
                placeholder="Enter account holder name"
              />
            </div>

            <div>
              <Label className="text-white">Account Number</Label>
              <div className="relative">
                <Input
                  type={showSensitive ? "text" : "password"}
                  value={paymentData.bank_account.account_number}
                  onChange={(e) => setPaymentData({ 
                    ...paymentData, 
                    bank_account: { ...paymentData.bank_account, account_number: e.target.value }
                  })}
                  className="pr-10 bg-gray-800/50 border-gray-600 text-white"
                  placeholder="Enter account number"
                />
                <button
                  type="button"
                  onClick={() => setShowSensitive(!showSensitive)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showSensitive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <Label className="text-white">IFSC Code</Label>
              <Input
                type="text"
                value={paymentData.bank_account.ifsc_code}
                onChange={(e) => setPaymentData({ 
                  ...paymentData, 
                  bank_account: { ...paymentData.bank_account, ifsc_code: e.target.value.toUpperCase() }
                })}
                className="bg-gray-800/50 border-gray-600 text-white"
                placeholder="Enter IFSC code"
              />
            </div>

            <div>
              <Label className="text-white">Bank Name</Label>
              <Input
                type="text"
                value={paymentData.bank_account.bank_name}
                onChange={(e) => setPaymentData({ 
                  ...paymentData, 
                  bank_account: { ...paymentData.bank_account, bank_name: e.target.value }
                })}
                className="bg-gray-800/50 border-gray-600 text-white"
                placeholder="Enter bank name"
              />
            </div>
          </motion.div>
        )}

        {/* USDT TRC-20 Setup */}
        {activeTab === 'usdt' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div>
              <Label className="text-white">USDT TRC-20 Wallet Address</Label>
              <div className="relative">
                <Input
                  type="text"
                  value={paymentData.usdt_address}
                  onChange={(e) => setPaymentData({ ...paymentData, usdt_address: e.target.value })}
                  className="pr-10 bg-gray-800/50 border-gray-600 text-white font-mono text-sm"
                  placeholder="Enter your USDT TRC-20 wallet address"
                />
                {paymentData.usdt_address && (
                  <button
                    type="button"
                    onClick={() => copyToClipboard(paymentData.usdt_address)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-400 mt-1">
                Only TRC-20 network addresses are supported
              </p>
            </div>

            <div className="p-4 bg-orange-600/20 rounded-lg border border-orange-600/30">
              <h4 className="text-orange-400 font-semibold mb-2">Important Notes:</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Only use USDT TRC-20 wallet addresses</li>
                <li>• Double-check your address before saving</li>
                <li>• Wrong addresses may result in permanent loss of funds</li>
              </ul>
            </div>
          </motion.div>
        )}

        <Button 
          onClick={handleSave}
          disabled={loading}
          className="w-full mt-6 neon-glow bg-gradient-to-r from-green-600 to-emerald-600"
        >
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Saving...' : 'Save Payment Method'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PaymentMethodSetup;
