
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
  Settings,
  Gift,
  Users,
  DollarSign,
  TrendingUp,
  Save
} from 'lucide-react';

interface Setting {
  id: string;
  key: string;
  value: any;
  description: string;
}

export const AdminSettingsManager = () => {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .order('key');

      if (error) throw error;
      setSettings(data || []);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch settings',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSetting = async (key: string, newValue: any) => {
    try {
      setSaving(true);
      const { error } = await supabase
        .from('settings')
        .update({ value: newValue })
        .eq('key', key);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Setting updated successfully',
      });
      fetchSettings();
    } catch (error) {
      console.error('Error updating setting:', error);
      toast({
        title: 'Error',
        description: 'Failed to update setting',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const getSetting = (key: string) => {
    return settings.find(s => s.key === key);
  };

  if (loading) {
    return (
      <Card className="glass-card border-gray-700">
        <CardContent className="p-8 text-center">
          <div className="animate-pulse text-white">Loading settings...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Bonus Settings */}
      <Card className="glass-card border-gray-700">
        <CardHeader>
          <CardTitle className="text-white hindi-font flex items-center gap-2">
            <Gift className="w-6 h-6 text-purple-400" />
            Bonus & Reward Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <BonusSetting
            title="Signup Bonus"
            description="Bonus amount given to new users on registration"
            setting={getSetting('signup_bonus')}
            onUpdate={(value) => handleUpdateSetting('signup_bonus', value)}
            saving={saving}
          />
          
          <BonusSetting
            title="Welcome Bonus"
            description="Welcome bonus for first-time users"
            setting={getSetting('welcome_bonus')}
            onUpdate={(value) => handleUpdateSetting('welcome_bonus', value)}
            saving={saving}
          />
          
          <BonusSetting
            title="Referral Bonus"
            description="Bonus amount for successful referrals"
            setting={getSetting('referral_bonus')}
            onUpdate={(value) => handleUpdateSetting('referral_bonus', value)}
            saving={saving}
          />
        </CardContent>
      </Card>

      {/* Commission Settings */}
      <Card className="glass-card border-gray-700">
        <CardHeader>
          <CardTitle className="text-white hindi-font flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-yellow-400" />
            Commission & Fee Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CommissionSetting
            setting={getSetting('withdrawal_commission')}
            onUpdate={(value) => handleUpdateSetting('withdrawal_commission', value)}
            saving={saving}
          />
        </CardContent>
      </Card>

      {/* Exchange Rate Settings */}
      <Card className="glass-card border-gray-700">
        <CardHeader>
          <CardTitle className="text-white hindi-font flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-green-400" />
            Exchange Rate Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ExchangeRateSetting
            setting={getSetting('exchange_rate')}
            onUpdate={(value) => handleUpdateSetting('exchange_rate', value)}
            saving={saving}
          />
        </CardContent>
      </Card>

      {/* Withdrawal Limits */}
      <Card className="glass-card border-gray-700">
        <CardHeader>
          <CardTitle className="text-white hindi-font flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-400" />
            Withdrawal Limits
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <LimitSetting
            title="Minimum Withdrawal"
            description="Minimum amount users can withdraw"
            setting={getSetting('min_withdrawal')}
            onUpdate={(value) => handleUpdateSetting('min_withdrawal', value)}
            saving={saving}
          />
          
          <LimitSetting
            title="Maximum Withdrawal"
            description="Maximum amount users can withdraw per day"
            setting={getSetting('max_withdrawal')}
            onUpdate={(value) => handleUpdateSetting('max_withdrawal', value)}
            saving={saving}
          />
        </CardContent>
      </Card>
    </div>
  );
};

const BonusSetting = ({ title, description, setting, onUpdate, saving }: any) => {
  const [amount, setAmount] = useState(setting?.value?.amount || 0);
  const [currency, setCurrency] = useState(setting?.value?.currency || 'INR');

  const handleSave = () => {
    onUpdate({ amount: Number(amount), currency });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-gray-800/50 rounded-lg"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Label className="text-white">Amount</Label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>
        <div className="w-32">
          <Label className="text-white">Currency</Label>
          <Input
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="bg-gray-700 border-gray-600 text-white"
            disabled
          />
        </div>
        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-purple-600 hover:bg-purple-700 mt-6"
        >
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
      </div>
    </motion.div>
  );
};

const CommissionSetting = ({ setting, onUpdate, saving }: any) => {
  const [rates, setRates] = useState({
    upi: setting?.value?.upi || 0.02,
    bank_transfer: setting?.value?.bank_transfer || 0.05,
    usdt_trc20: setting?.value?.usdt_trc20 || 0.01
  });

  const handleSave = () => {
    onUpdate(rates);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-gray-800/50 rounded-lg"
    >
      <h3 className="text-lg font-semibold text-white mb-4">Withdrawal Commission Rates</h3>
      
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <Label className="text-white">UPI Commission (%)</Label>
          <Input
            type="number"
            step="0.01"
            value={rates.upi * 100}
            onChange={(e) => setRates({ ...rates, upi: Number(e.target.value) / 100 })}
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>
        <div>
          <Label className="text-white">Bank Transfer (%)</Label>
          <Input
            type="number"
            step="0.01"
            value={rates.bank_transfer * 100}
            onChange={(e) => setRates({ ...rates, bank_transfer: Number(e.target.value) / 100 })}
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>
        <div>
          <Label className="text-white">USDT TRC-20 (%)</Label>
          <Input
            type="number"
            step="0.01"
            value={rates.usdt_trc20 * 100}
            onChange={(e) => setRates({ ...rates, usdt_trc20: Number(e.target.value) / 100 })}
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>
      </div>
      
      <Button 
        onClick={handleSave} 
        disabled={saving}
        className="bg-yellow-600 hover:bg-yellow-700"
      >
        <Save className="w-4 h-4 mr-2" />
        Save Commission Rates
      </Button>
    </motion.div>
  );
};

const ExchangeRateSetting = ({ setting, onUpdate, saving }: any) => {
  const [rate, setRate] = useState(setting?.value?.gbp_to_inr || 102.50);

  const handleSave = () => {
    onUpdate({ gbp_to_inr: Number(rate) });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-gray-800/50 rounded-lg"
    >
      <h3 className="text-lg font-semibold text-white mb-4">GBP to INR Exchange Rate</h3>
      
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Label className="text-white">1 GBP = ? INR</Label>
          <Input
            type="number"
            step="0.01"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>
        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-green-600 hover:bg-green-700 mt-6"
        >
          <Save className="w-4 h-4 mr-2" />
          Update Rate
        </Button>
      </div>
    </motion.div>
  );
};

const LimitSetting = ({ title, description, setting, onUpdate, saving }: any) => {
  const [amount, setAmount] = useState(setting?.value?.amount || 0);

  const handleSave = () => {
    onUpdate({ amount: Number(amount), currency: 'INR' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-gray-800/50 rounded-lg"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Label className="text-white">Amount (INR)</Label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>
        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 mt-6"
        >
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
      </div>
    </motion.div>
  );
};
