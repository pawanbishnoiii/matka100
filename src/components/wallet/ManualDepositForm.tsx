
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, DollarSign, CreditCard, Building2, Smartphone, Bitcoin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const ManualDepositForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    currency: 'INR',
    payment_method: 'upi',
    utr_number: '',
    transaction_id: '',
    notes: ''
  });
  const [screenshot, setScreenshot] = useState<File | null>(null);

  const paymentMethods = [
    { value: 'upi', label: 'UPI Payment', icon: Smartphone, color: 'text-green-400' },
    { value: 'bank_transfer', label: 'Bank Transfer', icon: Building2, color: 'text-blue-400' },
    { value: 'usdt_trc20', label: 'USDT (TRC20)', icon: Bitcoin, color: 'text-orange-400' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: 'File too large',
          description: 'Please select an image under 5MB',
          variant: 'destructive',
        });
        return;
      }
      setScreenshot(file);
    }
  };

  const uploadScreenshot = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}/${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('deposit-screenshots')
        .upload(fileName, file);

      if (error) throw error;
      return data.path;
    } catch (error) {
      console.error('Error uploading screenshot:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Validation
    if (!formData.amount || !formData.utr_number) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in amount and UTR number',
        variant: 'destructive',
      });
      return;
    }

    if (parseFloat(formData.amount) < 10) {
      toast({
        title: 'Minimum Amount',
        description: 'Minimum deposit amount is ₹10',
        variant: 'destructive',
      });
      return;
    }

    if (!screenshot) {
      toast({
        title: 'Screenshot Required',
        description: 'Please upload payment screenshot',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      // Upload screenshot
      const screenshotUrl = await uploadScreenshot(screenshot);
      if (!screenshotUrl) {
        throw new Error('Failed to upload screenshot');
      }

      // Create manual deposit record
      const { error } = await supabase
        .from('manual_deposits')
        .insert({
          user_id: user.id,
          amount: parseFloat(formData.amount),
          currency: formData.currency,
          payment_method: formData.payment_method,
          utr_number: formData.utr_number,
          transaction_id: formData.transaction_id || null,
          screenshot_url: screenshotUrl,
          notes: formData.notes || null,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: 'Deposit Request Submitted',
        description: 'Your manual deposit request has been submitted. Admin will review and approve within 5-30 minutes.',
      });

      // Reset form
      setFormData({
        amount: '',
        currency: 'INR',
        payment_method: 'upi',
        utr_number: '',
        transaction_id: '',
        notes: ''
      });
      setScreenshot(null);
      
      // Reset file input
      const fileInput = document.getElementById('screenshot') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (error) {
      console.error('Error submitting manual deposit:', error);
      toast({
        title: 'Submission Failed',
        description: 'Failed to submit deposit request. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="glass-card border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-green-400" />
          Manual Deposit Request
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Amount Selection */}
          <div className="space-y-2">
            <Label className="text-gray-300">Deposit Amount *</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="number"
                min="10"
                step="0.01"
                placeholder="Enter amount (Min: ₹10)"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                className="pl-10 bg-gray-800 border-gray-600 text-white"
                required
              />
            </div>
            <p className="text-xs text-gray-400">Minimum deposit: ₹10 | Maximum: ₹1,00,000</p>
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-2">
            <Label className="text-gray-300">Payment Method *</Label>
            <Select value={formData.payment_method} onValueChange={(value) => handleInputChange('payment_method', value)}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <SelectItem key={method.value} value={method.value}>
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${method.color}`} />
                        {method.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* UTR Number */}
          <div className="space-y-2">
            <Label className="text-gray-300">UTR Number *</Label>
            <Input
              type="text"
              placeholder="Enter 12-digit UTR number"
              value={formData.utr_number}
              onChange={(e) => handleInputChange('utr_number', e.target.value)}
              className="bg-gray-800 border-gray-600 text-white"
              maxLength={12}
              required
            />
            <p className="text-xs text-gray-400">Unique Transaction Reference number from your payment</p>
          </div>

          {/* Transaction ID (Optional) */}
          <div className="space-y-2">
            <Label className="text-gray-300">Transaction ID (Optional)</Label>
            <Input
              type="text"
              placeholder="Enter transaction ID if available"
              value={formData.transaction_id}
              onChange={(e) => handleInputChange('transaction_id', e.target.value)}
              className="bg-gray-800 border-gray-600 text-white"
            />
          </div>

          {/* Screenshot Upload */}
          <div className="space-y-2">
            <Label className="text-gray-300">Payment Screenshot *</Label>
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <input
                id="screenshot"
                type="file"
                accept="image/*"
                onChange={handleScreenshotChange}
                className="hidden"
                required
              />
              <label htmlFor="screenshot" className="cursor-pointer">
                <span className="text-gray-300">Click to upload screenshot</span>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
              </label>
              {screenshot && (
                <p className="text-green-400 text-sm mt-2">Selected: {screenshot.name}</p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label className="text-gray-300">Additional Notes (Optional)</Label>
            <Textarea
              placeholder="Any additional information..."
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              className="bg-gray-800 border-gray-600 text-white resize-none"
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            {loading ? 'Submitting...' : 'Submit Deposit Request'}
          </Button>

          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
            <h4 className="text-blue-400 font-semibold mb-2">Processing Information</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Manual verification required</li>
              <li>• Processing time: 5-30 minutes</li>
              <li>• Admin will verify your payment screenshot</li>
              <li>• Amount will be added to your balance after approval</li>
            </ul>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ManualDepositForm;
