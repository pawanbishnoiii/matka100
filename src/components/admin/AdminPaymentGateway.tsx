
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Save, Settings, DollarSign, Banknote, CheckCircle, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
  const [showSecrets, setShowSecrets] = useState(false);
  const [razorpayStatus, setRazorpayStatus] = useState<'unknown' | 'configured' | 'missing'>('unknown');
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
        const loadedSettings = {
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
        };
        
        setSettings(loadedSettings);
        
        // Check Razorpay configuration status
        if (loadedSettings.razorpay_key_id && loadedSettings.razorpay_key_secret) {
          setRazorpayStatus('configured');
        } else {
          setRazorpayStatus('missing');
        }
      } else {
        setRazorpayStatus('missing');
      }
    } catch (error) {
      console.error('Error fetching payment settings:', error);
      setRazorpayStatus('missing');
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
      // Validate Razorpay credentials format
      if (settings.razorpay_key_id && !settings.razorpay_key_id.startsWith('rzp_')) {
        throw new Error('Razorpay Key ID should start with "rzp_"');
      }

      const { error } = await supabase
        .from('payment_settings')
        .upsert(settings, { onConflict: 'id' });

      if (error) throw error;

      // Update status after successful save
      if (settings.razorpay_key_id && settings.razorpay_key_secret) {
        setRazorpayStatus('configured');
      } else {
        setRazorpayStatus('missing');
      }

      toast({
        title: 'Success',
        description: 'Payment settings saved successfully',
      });
    } catch (error: any) {
      console.error('Error saving payment settings:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save payment settings',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const testRazorpayConnection = async () => {
    if (!settings.razorpay_key_id || !settings.razorpay_key_secret) {
      toast({
        title: 'Missing Credentials',
        description: 'Please enter Razorpay Key ID and Secret first',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Test the connection by trying to create a small test order
      const { data, error } = await supabase.functions.invoke('razorpay-payment', {
        body: {
          amount: 1, // ₹1 for testing
          currency: 'INR',
          receipt: `test_${Date.now()}`,
          notes: { test: 'connection_test' }
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data && data.success) {
        toast({
          title: 'Connection Successful! ✅',
          description: 'Razorpay integration is working properly',
        });
        setRazorpayStatus('configured');
      } else {
        throw new Error(data?.error || 'Test failed');
      }
    } catch (error: any) {
      console.error('Razorpay test failed:', error);
      toast({
        title: 'Connection Failed',
        description: error.message || 'Failed to connect to Razorpay',
        variant: 'destructive',
      });
      setRazorpayStatus('missing');
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
      {/* Razorpay Status Alert */}
      {razorpayStatus === 'missing' && (
        <Alert className="border-yellow-600 bg-yellow-900/20">
          <AlertTriangle className="h-4 w-4 text-yellow-400" />
          <AlertDescription className="text-yellow-300">
            Razorpay is not configured. Users won't be able to make instant deposits until you add your Razorpay credentials below.
          </AlertDescription>
        </Alert>
      )}

      {razorpayStatus === 'configured' && (
        <Alert className="border-green-600 bg-green-900/20">
          <CheckCircle className="h-4 w-4 text-green-400" />
          <AlertDescription className="text-green-300">
            Razorpay integration is active and ready to accept payments.
          </AlertDescription>
        </Alert>
      )}

      {/* Razorpay Settings */}
      <Card className="glass-card border-gray-700">
        <CardHeader>
          <CardTitle className="text-white hindi-font flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-blue-400" />
            Razorpay Configuration
            {razorpayStatus === 'configured' && (
              <CheckCircle className="w-5 h-5 text-green-400" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white">Razorpay Key ID</Label>
              <Input
                type="text"
                value={settings.razorpay_key_id}
                onChange={(e) => setSettings(prev => ({ ...prev, razorpay_key_id: e.target.value }))}
                className="bg-gray-800 border-gray-600 text-white font-mono"
                placeholder="rzp_live_xxxxxxxxxx or rzp_test_xxxxxxxxxx"
              />
              <p className="text-xs text-gray-400">
                Get this from your Razorpay Dashboard → API Keys
              </p>
            </div>
            <div className="space-y-2">
              <Label className="text-white">Razorpay Key Secret</Label>
              <div className="relative">
                <Input
                  type={showSecrets ? "text" : "password"}
                  value={settings.razorpay_key_secret}
                  onChange={(e) => setSettings(prev => ({ ...prev, razorpay_key_secret: e.target.value }))}
                  className="bg-gray-800 border-gray-600 text-white font-mono pr-10"
                  placeholder="Enter your secret key"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowSecrets(!showSecrets)}
                >
                  {showSecrets ? (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-400" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-gray-400">
                Keep this secret and never share it publicly
              </p>
            </div>
          </div>
          
          <div className="flex gap-2 pt-2">
            <Button
              onClick={testRazorpayConnection}
              variant="outline"
              size="sm"
              className="border-blue-600 text-blue-400 hover:bg-blue-900/20"
            >
              Test Connection
            </Button>
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
