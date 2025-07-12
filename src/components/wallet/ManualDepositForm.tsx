
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

// Payment Method Icons (SVG)
const GooglePayIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6">
    <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const PhonePeIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6">
    <path fill="#5f259f" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 6L12 10.5 8.5 8 12 5.5 15.5 8zM8.5 16L12 13.5 15.5 16 12 18.5 8.5 16z"/>
  </svg>
);

const PaytmIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6">
    <path fill="#00baf2" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-3-3 1.41-1.41L10 14.17l5.59-5.59L17 10l-7 7z"/>
  </svg>
);

const SBIIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6">
    <rect fill="#1f4e79" width="24" height="24" rx="4"/>
    <text x="12" y="15" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">SBI</text>
  </svg>
);

const HDFCIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6">
    <rect fill="#004c8f" width="24" height="24" rx="4"/>
    <text x="12" y="15" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">HDFC</text>
  </svg>
);

const ICICIIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6">
    <rect fill="#f47920" width="24" height="24" rx="4"/>
    <text x="12" y="15" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">ICICI</text>
  </svg>
);

const BOBIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6">
    <rect fill="#ff6b35" width="24" height="24" rx="4"/>
    <text x="12" y="15" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">BOB</text>
  </svg>
);

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
    { 
      value: 'upi', 
      label: 'UPI Payment', 
      icon: Smartphone, 
      color: 'text-green-400',
      providers: [
        { name: 'Google Pay', icon: GooglePayIcon },
        { name: 'PhonePe', icon: PhonePeIcon },
        { name: 'Paytm', icon: PaytmIcon }
      ],
      instructions: [
        'Open your UPI app (Google Pay, PhonePe, or Paytm)',
        'Scan the QR code or use our UPI ID: payments@matka100.com',
        'Enter the exact amount shown above',
        'Complete the payment and note down the UTR number',
        'Upload screenshot and UTR number below'
      ]
    },
    { 
      value: 'bank_transfer', 
      label: 'Bank Transfer', 
      icon: Building2, 
      color: 'text-blue-400',
      providers: [
        { name: 'SBI', icon: SBIIcon },
        { name: 'HDFC', icon: HDFCIcon },
        { name: 'ICICI', icon: ICICIIcon },
        { name: 'BOB', icon: BOBIcon }
      ],
      instructions: [
        'Login to your bank account (Net Banking or Mobile App)',
        'Add beneficiary: Matka100 Gaming Pvt Ltd',
        'Account: 1234567890, IFSC: SBIN0001234',
        'Transfer the exact amount shown above',
        'Note down the transaction reference number',
        'Upload screenshot and transaction details below'
      ]
    },
    { 
      value: 'usdt_trc20', 
      label: 'USDT (TRC20)', 
      icon: Bitcoin, 
      color: 'text-orange-400',
      providers: [],
      instructions: [
        'Open your USDT TRC20 wallet (Trust Wallet, Binance, etc.)',
        'Send USDT to our TRC20 address:',
        'TRX Address: TPF8Lv7eGbPxCrNcQ9HQx7k8rJf2F7tYwP',
        'Network: TRON (TRC20) - Very Important!',
        'Send exact USD equivalent of your INR amount',
        'Save transaction hash and upload screenshot below'
      ]
    }
  ];

  const selectedMethod = paymentMethods.find(method => method.value === formData.payment_method);

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
        description: 'Please fill in amount and UTR/Transaction number',
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
        title: 'Deposit Request Submitted! 🎉',
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

          {/* Payment Method Info */}
          {selectedMethod && (
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
              <h4 className="text-blue-400 font-semibold mb-3 flex items-center gap-2">
                <selectedMethod.icon className={`w-5 h-5 ${selectedMethod.color}`} />
                {selectedMethod.label} Instructions
              </h4>
              
              {/* Provider Icons */}
              {selectedMethod.providers.length > 0 && (
                <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-600">
                  <span className="text-sm text-gray-300">Supported:</span>
                  {selectedMethod.providers.map((provider, index) => (
                    <div key={index} className="flex items-center gap-1">
                      <provider.icon />
                      <span className="text-xs text-gray-400">{provider.name}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Instructions */}
              <ol className="text-sm text-gray-300 space-y-1">
                {selectedMethod.instructions.map((instruction, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-400 font-bold min-w-[20px]">{index + 1}.</span>
                    <span>{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* UTR Number */}
          <div className="space-y-2">
            <Label className="text-gray-300">
              {formData.payment_method === 'usdt_trc20' ? 'Transaction Hash *' : 'UTR Number *'}
            </Label>
            <Input
              type="text"
              placeholder={formData.payment_method === 'usdt_trc20' ? 'Enter transaction hash' : 'Enter 12-digit UTR number'}
              value={formData.utr_number}
              onChange={(e) => handleInputChange('utr_number', e.target.value)}
              className="bg-gray-800 border-gray-600 text-white"
              required
            />
            <p className="text-xs text-gray-400">
              {formData.payment_method === 'usdt_trc20' 
                ? 'Transaction hash from your crypto wallet' 
                : 'Unique Transaction Reference number from your payment'
              }
            </p>
          </div>

          {/* Transaction ID (Optional) */}
          <div className="space-y-2">
            <Label className="text-gray-300">Additional Transaction ID (Optional)</Label>
            <Input
              type="text"
              placeholder="Enter additional transaction ID if available"
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
                <p className="text-green-400 text-sm mt-2">✓ Selected: {screenshot.name}</p>
              )}
            </div>
          </div>

          {/* User Message */}
          <div className="space-y-2">
            <Label className="text-gray-300">Message to Admin (Optional)</Label>
            <Textarea
              placeholder="Any additional information or special instructions..."
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
            {loading ? 'Submitting Request...' : 'Submit Deposit Request'}
          </Button>

          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
            <h4 className="text-yellow-400 font-semibold mb-2">⚡ Processing Information</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• <strong>Fast Processing:</strong> 5-30 minutes during business hours</li>
              <li>• <strong>24/7 Support:</strong> Contact us for urgent requests</li>
              <li>• <strong>Secure Verification:</strong> All payments are manually verified</li>
              <li>• <strong>Instant Credit:</strong> Amount added immediately after approval</li>
            </ul>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ManualDepositForm;
