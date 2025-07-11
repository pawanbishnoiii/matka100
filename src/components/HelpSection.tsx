import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  HelpCircle, 
  Send, 
  MessageSquare, 
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
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

const HelpSection = () => {
  const [tickets, setTickets] = useState<HelpTicket[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const [newTicket, setNewTicket] = useState({
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

    setLoading(true);
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
      toast({
        title: 'Error',
        description: 'Failed to fetch help tickets',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!newTicket.subject.trim() || !newTicket.message.trim()) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('help_tickets')
        .insert({
          user_id: user.id,
          subject: newTicket.subject.trim(),
          message: newTicket.message.trim(),
          priority: newTicket.priority,
          status: 'open'
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Help ticket submitted successfully',
      });

      setNewTicket({
        subject: '',
        message: '',
        priority: 'medium'
      });

      fetchTickets();
    } catch (error) {
      console.error('Error submitting ticket:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit help ticket',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-yellow-600/20 text-yellow-400';
      case 'closed':
        return 'bg-green-600/20 text-green-400';
      case 'in_progress':
        return 'bg-blue-600/20 text-blue-400';
      default:
        return 'bg-gray-600/20 text-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-600/20 text-red-400';
      case 'medium':
        return 'bg-yellow-600/20 text-yellow-400';
      case 'low':
        return 'bg-green-600/20 text-green-400';
      default:
        return 'bg-gray-600/20 text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Create New Ticket */}
      <Card className="glass-card border-gray-700">
        <CardHeader>
          <CardTitle className="text-white hindi-font flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-400" />
            Get Help & Support
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-white">Subject</Label>
              <Input
                type="text"
                value={newTicket.subject}
                onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                className="bg-gray-800/50 border-gray-600 text-white"
                placeholder="Brief description of your issue"
                required
              />
            </div>

            <div>
              <Label className="text-white">Priority</Label>
              <select
                value={newTicket.priority}
                onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                className="w-full p-2 bg-gray-800/50 border border-gray-600 rounded-md text-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <Label className="text-white">Message</Label>
              <Textarea
                value={newTicket.message}
                onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })}
                className="bg-gray-800/50 border-gray-600 text-white min-h-[120px]"
                placeholder="Describe your issue in detail..."
                required
              />
            </div>

            <Button 
              type="submit"
              disabled={submitting}
              className="neon-glow bg-gradient-to-r from-blue-600 to-purple-600"
            >
              <Send className="w-4 h-4 mr-2" />
              {submitting ? 'Submitting...' : 'Submit Ticket'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Existing Tickets */}
      <Card className="glass-card border-gray-700">
        <CardHeader>
          <CardTitle className="text-white hindi-font flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-green-400" />
            Your Support Tickets
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass-card p-4 rounded-lg animate-pulse">
                  <div className="h-4 bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded mb-1"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <HelpCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No support tickets yet</p>
              <p className="text-sm">Create a ticket above if you need help</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-4 rounded-lg"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-white font-semibold">{ticket.subject}</h3>
                      <p className="text-sm text-gray-400">
                        {new Date(ticket.created_at).toLocaleDateString()} at{' '}
                        {new Date(ticket.created_at).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority.toUpperCase()}
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusColor(ticket.status)}`}>
                        {getStatusIcon(ticket.status)}
                        {ticket.status.replace('_', ' ').toUpperCase()}
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-300 mb-3">{ticket.message}</p>

                  {ticket.admin_response && (
                    <div className="bg-blue-600/20 p-3 rounded-lg border border-blue-600/30">
                      <h4 className="text-blue-400 font-semibold mb-1">Admin Response:</h4>
                      <p className="text-gray-300">{ticket.admin_response}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HelpSection;
