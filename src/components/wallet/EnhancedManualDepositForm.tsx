
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, DollarSign, CreditCard, Building2, Smartphone, Bitcoin, Copy, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Payment Method Icons (Enhanced SVG)
const GooglePayIcon = () => (
  <svg viewBox="0 0 48 48" className="w-10 h-10">
    <path fill="#4285f4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.52h11.84c-.52 2.74-2.08 5.06-4.42 6.62v5.54h7.14c4.16-3.84 6.56-9.48 6.56-16.18z"/>
    <path fill="#34a853" d="M24 46c5.94 0 10.92-1.96 14.56-5.32l-7.14-5.54c-1.96 1.32-4.46 2.12-7.42 2.12-5.72 0-10.58-3.86-12.32-9.06H4.32v5.68C7.98 41.04 15.4 46 24 46z"/>
    <path fill="#fbbc05" d="M11.68 28.2c-.44-1.32-.7-2.72-.7-4.18s.26-2.86.7-4.18V14.16H4.32C2.86 17.08 2 20.42 2 24s.86 6.92 2.32 9.84l9.36-5.64z"/>
    <path fill="#ea4335" d="M24 10.76c3.24 0 6.12 1.12 8.42 3.28l6.3-6.3C34.9 4.18 29.94 2 24 2 15.4 2 7.98 6.96 4.32 14.16l9.36 5.68c1.74-5.2 6.6-9.08 12.32-9.08z"/>
  </svg>
);

const PhonePeIcon = () => (
  <svg viewBox="0 0 48 48" className="w-10 h-10">
    <circle fill="#5f259f" cx="24" cy="24" r="22"/>
    <path fill="white" d="M24 8l-8 16h8v16l8-16h-8V8z"/>
    <text x="24" y="40" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">PhonePe</text>
  </svg>
);

const PaytmIcon = () => (
  <svg viewBox="0 0 48 48" className="w-10 h-10">
    <circle fill="#00baf2" cx="24" cy="24" r="22"/>
    <path fill="white" d="M16 16h16v4H20v12h-4V16zM28 20h4v12h-4V20z"/>
    <text x="24" y="42" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">Paytm</text>
  </svg>
);

const SBIIcon = () => (
  <svg viewBox="0 0 48 48" className="w-10 h-10">
    <rect fill="#1f4e79" width="48" height="48" rx="8"/>
    <text x="24" y="28" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">SBI</text>
  </svg>
);

const HDFCIcon = () => (
  <svg viewBox="0 0 48 48" className="w-10 h-10">
    <rect fill="#004c8f" width="48" height="48" rx="8"/>
    <text x="24" y="28" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">HDFC</text>
  </svg>
);

const ICICIIcon = () => (
  <svg viewBox="0 0 48 48" className="w-10 h-10">
    <rect fill="#f47920" width="48" height="48" rx="8"/>
    <text x="24" y="28" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">ICICI</text>
  </svg>
);

const BOBIcon = () => (
  <svg viewBox="0 0 48 48" className="w-10 h-10">
    <rect fill="#ff6b35" width="48" height="48" rx="8"/>
    <text x="24" y="28" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">BOB</text>
  </svg>
);

interface EnhancedManualDepositFormProps {
  onSuccess?: () => void;
}

const EnhancedManualDepositForm = ({ onSuccess }: EnhancedManualDepositFormProps = {}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [paymentSettings, setPaymentSettings] = useState<any>(null);
  const [copiedText, setCopiedText] = useState<string>('');
  const [formData, setFormData] = useState({
    amount: '',
    currency: 'INR',
    payment_method: 'upi',
    utr_number: '',
    transaction_id: '',
    notes: ''
  });
  const [screenshot, setScreenshot] = useState<File | null>(null);

  useEffect(() => {
    fetchPaymentSettings();
  }, []);

  const fetchPaymentSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_settings')
        .select('*')
        .single();

      if (error) {
        console.error('Error fetching payment settings:', error);
        return;
      }

      setPaymentSettings(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(label);
      toast({
        title: 'Copied!',
        description: `${label} copied to clipboard`,
      });
      setTimeout(() => setCopiedText(''), 2000);
    } catch (error) {
      toast({
        title: 'Copy failed',
        description: 'Please copy manually',
        variant: 'destructive',
      });
    }
  };

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
      ]
    },
    { 
      value: 'usdt_trc20', 
      label: 'USDT (TRC20)', 
      icon: Bitcoin, 
      color: 'text-orange-400',
      providers: []
    }
  ];

  const selectedMethod = paymentMethods.find(method => method.value === formData.payment_method);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
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
      const screenshotUrl = await uploadScreenshot(screenshot);
      if (!screenshotUrl) {
        throw new Error('Failed to upload screenshot');
      }

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

      // Call onSuccess callback
      onSuccess?.();

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

  const renderPaymentDetails = () => {
    if (!paymentSettings) return null;

    if (formData.payment_method === 'upi' && paymentSettings.upi_id) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-500/30 rounded-lg p-6 mb-6"
        >
          <h4 className="text-green-400 font-semibold mb-4 flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            UPI Payment Details
          </h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-black/30 rounded-lg p-3">
              <div>
                <p className="text-sm text-gray-400">UPI ID</p>
                <p className="text-white font-mono text-lg">{paymentSettings.upi_id}</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(paymentSettings.upi_id, 'UPI ID')}
                className="border-green-500 text-green-400 hover:bg-green-500/10"
              >
                {copiedText === 'UPI ID' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copiedText === 'UPI ID' ? 'Copied' : 'Copy'}
              </Button>
            </div>
            
            <div className="flex items-center gap-3 pt-3 border-t border-gray-600">
              <span className="text-sm text-gray-300">Supported Apps:</span>
              {selectedMethod?.providers.map((provider, index) => (
                <div key={index} className="flex items-center gap-1">
                  <provider.icon />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      );
    }

    if (formData.payment_method === 'bank_transfer' && (paymentSettings.account_number || paymentSettings.bank_name)) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-500/30 rounded-lg p-6 mb-6"
        >
          <h4 className="text-blue-400 font-semibold mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Bank Transfer Details
          </h4>
          
          <div className="space-y-3">
            {paymentSettings.bank_name && (
              <div className="flex items-center justify-between bg-black/30 rounded-lg p-3">
                <div>
                  <p className="text-sm text-gray-400">Bank Name</p>
                  <p className="text-white font-semibold">{paymentSettings.bank_name}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(paymentSettings.bank_name, 'Bank Name')}
                  className="border-blue-500 text-blue-400 hover:bg-blue-500/10"
                >
                  {copiedText === 'Bank Name' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            )}
            
            {paymentSettings.account_number && (
              <div className="flex items-center justify-between bg-black/30 rounded-lg p-3">
                <div>
                  <p className="text-sm text-gray-400">Account Number</p>
                  <p className="text-white font-mono">{paymentSettings.account_number}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(paymentSettings.account_number, 'Account Number')}
                  className="border-blue-500 text-blue-400 hover:bg-blue-500/10"
                >
                  {copiedText === 'Account Number' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            )}
            
            {paymentSettings.ifsc_code && (
              <div className="flex items-center justify-between bg-black/30 rounded-lg p-3">
                <div>
                  <p className="text-sm text-gray-400">IFSC Code</p>
                  <p className="text-white font-mono">{paymentSettings.ifsc_code}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(paymentSettings.ifsc_code, 'IFSC Code')}
                  className="border-blue-500 text-blue-400 hover:bg-blue-500/10"
                >
                  {copiedText === 'IFSC Code' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            )}

            {paymentSettings.account_holder_name && (
              <div className="flex items-center justify-between bg-black/30 rounded-lg p-3">
                <div>
                  <p className="text-sm text-gray-400">Account Holder</p>
                  <p className="text-white font-semibold">{paymentSettings.account_holder_name}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(paymentSettings.account_holder_name, 'Account Holder')}
                  className="border-blue-500 text-blue-400 hover:bg-blue-500/10"
                >
                  {copiedText === 'Account Holder' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            )}
            
            <div className="flex items-center gap-3 pt-3 border-t border-gray-600">
              <span className="text-sm text-gray-300">Supported Banks:</span>
              {selectedMethod?.providers.map((provider, index) => (
                <div key={index} className="flex items-center gap-1">
                  <provider.icon />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      );
    }

    if (formData.payment_method === 'usdt_trc20' && paymentSettings.usdt_trc20_address) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-orange-900/30 to-yellow-900/30 border border-orange-500/30 rounded-lg p-6 mb-6"
        >
          <h4 className="text-orange-400 font-semibold mb-4 flex items-center gap-2">
            <Bitcoin className="w-5 h-5" />
            USDT TRC20 Payment Details
          </h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-black/30 rounded-lg p-3">
              <div className="flex-1">
                <p className="text-sm text-gray-400">TRC20 Wallet Address</p>
                <p className="text-white font-mono text-sm break-all">{paymentSettings.usdt_trc20_address}</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(paymentSettings.usdt_trc20_address, 'USDT Address')}
                className="border-orange-500 text-orange-400 hover:bg-orange-500/10 ml-3"
              >
                {copiedText === 'USDT Address' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
              <p className="text-red-400 text-sm font-semibold">⚠️ Important:</p>
              <p className="text-gray-300 text-sm">Only send USDT on TRC20 network. Other networks will result in loss of funds!</p>
            </div>
          </div>
        </motion.div>
      );
    }

    return null;
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

          {/* Payment Details */}
          {renderPaymentDetails()}

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
          </div>

          {/* Transaction ID */}
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
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-green-500/50 transition-colors">
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
                <span className="text-gray-300 hover:text-green-400 transition-colors">Click to upload screenshot</span>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
              </label>
              {screenshot && (
                <p className="text-green-400 text-sm mt-2 flex items-center justify-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  Selected: {screenshot.name}
                </p>
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
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Submitting Request...
              </div>
            ) : (
              'Submit Deposit Request'
            )}
          </Button>

          <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-500/30 rounded-lg p-4">
            <h4 className="text-yellow-400 font-semibold mb-2 flex items-center gap-2">
              ⚡ Processing Information
            </h4>
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

export default EnhancedManualDepositForm;
