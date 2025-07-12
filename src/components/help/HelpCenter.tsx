
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  HelpCircle, 
  MessageSquare, 
  Send, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Phone,
  Mail,
  MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface HelpTicket {
  id: string;
  subject: string;
  message: string;
  status: string;
  priority: string;
  admin_response: string | null;
  created_at: string;
  updated_at: string;
}

export const HelpCenter = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tickets, setTickets] = useState<HelpTicket[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    priority: 'medium'
  });

  useEffect(() => {
    if (user) {
      fetchTickets();
    }
  }, [user]);

  const fetchTickets = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('help_tickets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTickets(data || []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('help_tickets')
        .insert({
          user_id: user.id,
          subject: formData.subject,
          message: formData.message,
          priority: formData.priority,
          status: 'open'
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Your help ticket has been submitted successfully',
      });

      setFormData({ subject: '', message: '', priority: 'medium' });
      fetchTickets();
    } catch (error) {
      console.error('Error submitting ticket:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit help ticket',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'closed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'in_progress':
        return <AlertCircle className="w-4 h-4 text-blue-400" />;
      default:
        return <HelpCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      {/* Contact Info */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card className="glass-card border-gray-700">
          <CardContent className="p-4 text-center">
            <Phone className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <h3 className="text-white font-semibold">Phone Support</h3>
            <p className="text-gray-400 text-sm">+91 9876543210</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-gray-700">
          <CardContent className="p-4 text-center">
            <Mail className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <h3 className="text-white font-semibold">Email Support</h3>
            <p className="text-gray-400 text-sm">support@matka.com</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-gray-700">
          <CardContent className="p-4 text-center">
            <MessageCircle className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <h3 className="text-white font-semibold">Live Chat</h3>
            <p className="text-gray-400 text-sm">24/7 Available</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Submit New Ticket */}
        <Card className="glass-card border-gray-700">
          <CardHeader>
            <CardTitle className="text-white hindi-font flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Submit Help Ticket
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white">Subject</Label>
                <Input
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="Brief description of your issue"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Priority</Label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                  className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md text-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-white">Message</Label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  className="bg-gray-800 border-gray-600 text-white min-h-[120px]"
                  placeholder="Describe your issue in detail..."
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    Submit Ticket
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* My Tickets */}
        <Card className="glass-card border-gray-700">
          <CardHeader>
            <CardTitle className="text-white hindi-font flex items-center gap-2">
              <HelpCircle className="w-5 h-5" />
              My Tickets
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 max-h-[500px] overflow-y-auto">
            {tickets.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No tickets found</p>
            ) : (
              tickets.map((ticket) => (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 bg-gray-800/50 rounded-lg border border-gray-600"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-white font-semibold text-sm">{ticket.subject}</h4>
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                      {getStatusIcon(ticket.status)}
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                    {ticket.message}
                  </p>
                  {ticket.admin_response && (
                    <div className="bg-blue-900/30 p-3 rounded mt-2">
                      <p className="text-blue-300 text-sm font-semibold mb-1">Admin Response:</p>
                      <p className="text-blue-200 text-sm">{ticket.admin_response}</p>
                    </div>
                  )}
                  <p className="text-gray-500 text-xs mt-2">
                    {new Date(ticket.created_at).toLocaleString()}
                  </p>
                </motion.div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* FAQ Section */}
      <Card className="glass-card border-gray-700">
        <CardHeader>
          <CardTitle className="text-white hindi-font">Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <details className="group">
              <summary className="flex cursor-pointer items-center justify-between p-3 bg-gray-800/50 rounded-lg text-white hover:bg-gray-700/50">
                <span>How do I deposit money?</span>
                <span className="transition group-open:rotate-180">▼</span>
              </summary>
              <p className="px-3 py-2 text-gray-400 text-sm">
                You can deposit money through UPI, Bank Transfer, or USDT TRC-20. Go to the Wallet section and select your preferred payment method.
              </p>
            </details>
            <details className="group">
              <summary className="flex cursor-pointer items-center justify-between p-3 bg-gray-800/50 rounded-lg text-white hover:bg-gray-700/50">
                <span>How do I withdraw my winnings?</span>
                <span className="transition group-open:rotate-180">▼</span>
              </summary>
              <p className="px-3 py-2 text-gray-400 text-sm">
                Withdrawals can be made to your registered UPI ID, Bank Account, or USDT wallet. Minimum withdrawal amount is ₹50.
              </p>
            </details>
            <details className="group">
              <summary className="flex cursor-pointer items-center justify-between p-3 bg-gray-800/50 rounded-lg text-white hover:bg-gray-700/50">
                <span>When are game results declared?</span>
                <span className="transition group-open:rotate-180">▼</span>
              </summary>
              <p className="px-3 py-2 text-gray-400 text-sm">
                Game results are declared at specified times for each game. You can check the results page for the latest outcomes.
              </p>
            </details>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
