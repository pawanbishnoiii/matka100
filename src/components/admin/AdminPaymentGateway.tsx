
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Save, Settings, DollarSign, Banknote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PaymentSettings {
  id?: string;
  razorpay_key_id: string;
  razorpay_key_secret: string;
  upi_id: string;
  bank_name: string;
  account_number: string;
  ifsc_code: string;
  account_holder_name: string;
  usdt_trc20_address: string;
  min_deposit_amount: number;
  max_deposit_amount: number;
  min_withdrawal_amount: number;
  max_withdrawal_amount: number;
  withdrawal_fee_percentage: number;
}

export const AdminPaymentGateway = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<PaymentSettings>({
    razorpay_key_id: '',
    razorpay_key_secret: '',
    upi_id: '',
    bank_name: '',
    account_number: '',
    ifsc_code: '',
    account_holder_name: '',
    usdt_trc20_address: '',
    min_deposit_amount: 10,
    max_deposit_amount: 100000,
    min_withdrawal_amount: 50,
    max_withdrawal_amount: 50000,
    withdrawal_fee_percentage: 2
  });

  useEffect(() => {
    fetchPaymentSettings();
  }, []);

  const fetchPaymentSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('payment_settings')
        .select('*')
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setSettings({
          id: data.id,
          razorpay_key_id: data.razorpay_key_id || '',
          razorpay_key_secret: data.razorpay_key_secret || '',
          upi_id: data.upi_id || '',
          bank_name: data.bank_name || '',
          account_number: data.account_number || '',
          ifsc_code: data.ifsc_code || '',
          account_holder_name: data.account_holder_name || '',
          usdt_trc20_address: data.usdt_trc20_address || '',
          min_deposit_amount: data.min_deposit_amount || 10,
          max_deposit_amount: data.max_deposit_amount || 100000,
          min_withdrawal_amount: data.min_withdrawal_amount || 50,
          max_withdrawal_amount: data.max_withdrawal_amount || 50000,
          withdrawal_fee_percentage: data.withdrawal_fee_percentage || 2
        });
      }
    } catch (error) {
      console.error('Error fetching payment settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch payment settings',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('payment_settings')
        .upsert(settings, { onConflict: 'id' });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Payment settings saved successfully',
      });
    } catch (error) {
      console.error('Error saving payment settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save payment settings',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card className="glass-card border-gray-700">
        <CardContent className="p-8 text-center">
          <div className="animate-pulse text-white">Loading payment settings...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Razorpay Settings */}
      <Card className="glass-card border-gray-700">
        <CardHeader>
          <CardTitle className="text-white hindi-font flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-blue-400" />
            Razorpay Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white">Razorpay Key ID</Label>
              <Input
                type="password"
                value={settings.razorpay_key_id}
                onChange={(e) => setSettings(prev => ({ ...prev, razorpay_key_id: e.target.value }))}
                className="bg-gray-800 border-gray-600 text-white font-mono"
                placeholder="rzp_live_xxxxxxxxxx"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Razorpay Key Secret</Label>
              <Input
                type="password"
                value={settings.razorpay_key_secret}
                onChange={(e) => setSettings(prev => ({ ...prev, razorpay_key_secret: e.target.value }))}
                className="bg-gray-800 border-gray-600 text-white font-mono"
                placeholder="Secret key"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bank Account Settings */}
      <Card className="glass-card border-gray-700">
        <CardHeader>
          <CardTitle className="text-white hindi-font flex items-center gap-2">
            <Banknote className="w-6 h-6 text-green-400" />
            Bank Account Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white">Bank Name</Label>
              <Input
                value={settings.bank_name}
                onChange={(e) => setSettings(prev => ({ ...prev, bank_name: e.target.value }))}
                className="bg-gray-800 border-gray-600 text-white"
                placeholder="State Bank of India"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Account Holder Name</Label>
              <Input
                value={settings.account_holder_name}
                onChange={(e) => setSettings(prev => ({ ...prev, account_holder_name: e.target.value }))}
                className="bg-gray-800 border-gray-600 text-white"
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Account Number</Label>
              <Input
                value={settings.account_number}
                onChange={(e) => setSettings(prev => ({ ...prev, account_number: e.target.value }))}
                className="bg-gray-800 border-gray-600 text-white font-mono"
                placeholder="1234567890"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">IFSC Code</Label>
              <Input
                value={settings.ifsc_code}
                onChange={(e) => setSettings(prev => ({ ...prev, ifsc_code: e.target.value }))}
                className="bg-gray-800 border-gray-600 text-white font-mono"
                placeholder="SBIN0001234"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* UPI & Crypto Settings */}
      <Card className="glass-card border-gray-700">
        <CardHeader>
          <CardTitle className="text-white hindi-font flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-purple-400" />
            UPI & Cryptocurrency
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white">UPI ID</Label>
              <Input
                value={settings.upi_id}
                onChange={(e) => setSettings(prev => ({ ...prev, upi_id: e.target.value }))}
                className="bg-gray-800 border-gray-600 text-white"
                placeholder="admin@paytm"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">USDT TRC-20 Address</Label>
              <Input
                value={settings.usdt_trc20_address}
                onChange={(e) => setSettings(prev => ({ ...prev, usdt_trc20_address: e.target.value }))}
                className="bg-gray-800 border-gray-600 text-white font-mono text-sm"
                placeholder="TRC-20 wallet address"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Limits */}
      <Card className="glass-card border-gray-700">
        <CardHeader>
          <CardTitle className="text-white hindi-font flex items-center gap-2">
            <Settings className="w-6 h-6 text-yellow-400" />
            Transaction Limits
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-white">Min Deposit (₹)</Label>
              <Input
                type="number"
                value={settings.min_deposit_amount}
                onChange={(e) => setSettings(prev => ({ ...prev, min_deposit_amount: Number(e.target.value) }))}
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Max Deposit (₹)</Label>
              <Input
                type="number"
                value={settings.max_deposit_amount}
                onChange={(e) => setSettings(prev => ({ ...prev, max_deposit_amount: Number(e.target.value) }))}
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Min Withdrawal (₹)</Label>
              <Input
                type="number"
                value={settings.min_withdrawal_amount}
                onChange={(e) => setSettings(prev => ({ ...prev, min_withdrawal_amount: Number(e.target.value) }))}
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Max Withdrawal (₹)</Label>
              <Input
                type="number"
                value={settings.max_withdrawal_amount}
                onChange={(e) => setSettings(prev => ({ ...prev, max_withdrawal_amount: Number(e.target.value) }))}
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Withdrawal Fee (%)</Label>
              <Input
                type="number"
                step="0.1"
                value={settings.withdrawal_fee_percentage}
                onChange={(e) => setSettings(prev => ({ ...prev, withdrawal_fee_percentage: Number(e.target.value) }))}
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          {saving ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Saving...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Save className="w-5 h-5" />
              Save Settings
            </div>
          )}
        </Button>
      </div>
    </div>
  );
};
