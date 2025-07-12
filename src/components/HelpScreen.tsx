
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  HelpCircle, 
  MessageSquare, 
  Phone, 
  Mail, 
  Search, 
  ChevronDown, 
  ChevronRight,
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  Home,
  Headphones,
  FileText,
  Users
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
}

interface Ticket {
  id: string;
  subject: string;
  message: string;
  status: string;
  priority: string;
  created_at: string;
  admin_response?: string;
}

const faqs: FAQ[] = [
  {
    id: 1,
    category: 'Getting Started',
    question: 'How do I start playing Matka games?',
    answer: 'First, create your account and add funds to your wallet. Then browse available games, select your numbers, place your bets, and wait for results!'
  },
  {
    id: 2,
    category: 'Payments',
    question: 'How can I deposit money?',
    answer: 'You can deposit money using UPI (Google Pay, PhonePe, Paytm), bank transfer, or USDT TRC20. Go to Wallet > Deposit to see all options.'
  },
  {
    id: 3,
    category: 'Payments',
    question: 'How long does withdrawal take?',
    answer: 'Withdrawals are typically processed within 2-24 hours. UPI withdrawals are faster than bank transfers.'
  },
  {
    id: 4,
    category: 'Games',
    question: 'What types of bets can I place?',
    answer: 'You can place Single Ank, Jodi, Single Patti, Double Patti, and Triple Patti bets. Each has different payout multipliers.'
  },
  {
    id: 5,
    category: 'Account',
    question: 'How do I verify my account?',
    answer: 'Complete your profile with valid information and upload required KYC documents when prompted. Verification usually takes 24-48 hours.'
  },
  {
    id: 6,
    category: 'Games',
    question: 'When are game results declared?',
    answer: 'Each game has specific result times. You can see the schedule on the games page or results section.'
  }
];

export const HelpScreen = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'faq' | 'contact' | 'tickets'>('faq');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [submittingTicket, setSubmittingTicket] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    message: '',
    priority: 'medium'
  });

  const categories = ['all', ...Array.from(new Set(faqs.map(faq => faq.category)))];

  useEffect(() => {
    if (user && activeTab === 'tickets') {
      fetchTickets();
    }
  }, [user, activeTab]);

  const fetchTickets = async () => {
    if (!user) return;
    
    setLoadingTickets(true);
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
        description: 'Failed to load support tickets',
        variant: 'destructive',
      });
    } finally {
      setLoadingTickets(false);
    }
  };

  const submitTicket = async () => {
    if (!user || !ticketForm.subject.trim() || !ticketForm.message.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in both subject and message',
        variant: 'destructive',
      });
      return;
    }

    setSubmittingTicket(true);
    try {
      const { error } = await supabase
        .from('help_tickets')
        .insert({
          user_id: user.id,
          subject: ticketForm.subject.trim(),
          message: ticketForm.message.trim(),
          priority: ticketForm.priority,
          status: 'open'
        });

      if (error) throw error;

      toast({
        title: 'Ticket Submitted! 🎫',
        description: 'Your support ticket has been created. We\'ll respond within 24 hours.',
      });

      setTicketForm({ subject: '', message: '', priority: 'medium' });
      await fetchTickets();
    } catch (error) {
      console.error('Error submitting ticket:', error);
      toast({
        title: 'Submission Failed',
        description: 'Failed to submit support ticket. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSubmittingTicket(false);
    }
  };

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge className="bg-blue-600/20 text-blue-400 border-blue-600/50"><Clock className="w-3 h-3 mr-1" />Open</Badge>;
      case 'in_progress':
        return <Badge className="bg-yellow-600/20 text-yellow-400 border-yellow-600/50"><AlertCircle className="w-3 h-3 mr-1" />In Progress</Badge>;
      case 'resolved':
        return <Badge className="bg-green-600/20 text-green-400 border-green-600/50"><CheckCircle className="w-3 h-3 mr-1" />Resolved</Badge>;
      case 'closed':
        return <Badge className="bg-gray-600/20 text-gray-400 border-gray-600/50">Closed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-600/20 text-yellow-400 border-yellow-600/50">Medium</Badge>;
      case 'low':
        return <Badge className="bg-green-600/20 text-green-400 border-green-600/50">Low</Badge>;
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
                <HelpCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white hindi-font">Help & Support</h1>
                <p className="text-gray-400">Get help with your Matka gaming experience</p>
              </div>
            </div>
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          </div>
        </motion.div>

        {/* Quick Contact Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <Card className="glass-card border-green-700/50 hover:border-green-600/70 transition-colors cursor-pointer">
            <CardContent className="p-4 text-center">
              <Headphones className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <h3 className="text-white font-semibold">Live Chat</h3>
              <p className="text-sm text-gray-400">Available 24/7</p>
              <Button size="sm" className="mt-2 bg-green-600 hover:bg-green-700">
                Chat Now
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-card border-blue-700/50 hover:border-blue-600/70 transition-colors cursor-pointer">
            <CardContent className="p-4 text-center">
              <Phone className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <h3 className="text-white font-semibold">Call Support</h3>
              <p className="text-sm text-gray-400">+91 98765 43210</p>
              <Button size="sm" variant="outline" className="mt-2 border-blue-600 text-blue-400">
                Call Now
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-card border-purple-700/50 hover:border-purple-600/70 transition-colors cursor-pointer">
            <CardContent className="p-4 text-center">
              <Mail className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <h3 className="text-white font-semibold">Email Support</h3>
              <p className="text-sm text-gray-400">support@matka100.com</p>
              <Button size="sm" variant="outline" className="mt-2 border-purple-600 text-purple-400">
                Send Email
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-800/50 p-1 rounded-lg mb-6">
            <button
              onClick={() => setActiveTab('faq')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === 'faq'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <FileText className="w-4 h-4" />
              FAQ
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === 'contact'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Contact Us
            </button>
            {user && (
              <button
                onClick={() => setActiveTab('tickets')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  activeTab === 'tickets'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <Users className="w-4 h-4" />
                My Tickets
                {tickets.length > 0 && (
                  <Badge className="bg-red-600 text-white text-xs px-1.5 py-0.5">
                    {tickets.filter(t => t.status === 'open').length}
                  </Badge>
                )}
              </button>
            )}
          </div>

          {/* FAQ Tab */}
          {activeTab === 'faq' && (
            <Card className="glass-card border-gray-700">
              <CardHeader>
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                  <CardTitle className="text-white">Frequently Asked Questions</CardTitle>
                  <div className="flex gap-4 items-center w-full md:w-auto">
                    <div className="relative flex-1 md:flex-none">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search FAQs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-gray-800/50 border-gray-600 text-white pl-10 md:w-64"
                      />
                    </div>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="bg-gray-800/50 border border-gray-600 text-white rounded-md px-3 py-2"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>
                          {cat === 'all' ? 'All Categories' : cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredFAQs.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <HelpCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No FAQs found matching your search</p>
                    </div>
                  ) : (
                    filteredFAQs.map((faq) => (
                      <motion.div
                        key={faq.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border border-gray-700 rounded-lg overflow-hidden"
                      >
                        <button
                          onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                          className="w-full p-4 text-left hover:bg-gray-800/50 transition-colors flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="text-xs">
                              {faq.category}
                            </Badge>
                            <span className="text-white font-medium">{faq.question}</span>
                          </div>
                          {expandedFAQ === faq.id ? (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                        {expandedFAQ === faq.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="border-t border-gray-700 bg-gray-800/30"
                          >
                            <div className="p-4">
                              <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <Card className="glass-card border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Contact Support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {!user && (
                  <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                    <p className="text-yellow-400">
                      Please log in to submit a support ticket, or use our live chat for immediate assistance.
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-gray-300">Subject *</Label>
                    <Input
                      value={ticketForm.subject}
                      onChange={(e) => setTicketForm(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder="Brief description of your issue"
                      className="bg-gray-800 border-gray-600 text-white"
                      disabled={!user}
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Priority</Label>
                    <select
                      value={ticketForm.priority}
                      onChange={(e) => setTicketForm(prev => ({ ...prev, priority: e.target.value }))}
                      className="w-full bg-gray-800 border border-gray-600 text-white rounded-md px-3 py-2"
                      disabled={!user}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label className="text-gray-300">Message *</Label>
                  <Textarea
                    value={ticketForm.message}
                    onChange={(e) => setTicketForm(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Describe your issue in detail..."
                    className="bg-gray-800 border-gray-600 text-white"
                    rows={6}
                    disabled={!user}
                  />
                </div>

                <Button
                  onClick={submitTicket}
                  disabled={submittingTicket || !user}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {submittingTicket ? (
                    'Submitting...'
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Ticket
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Tickets Tab */}
          {activeTab === 'tickets' && user && (
            <Card className="glass-card border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">My Support Tickets</CardTitle>
                  <Button
                    onClick={fetchTickets}
                    disabled={loadingTickets}
                    variant="outline"
                    size="sm"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loadingTickets ? (
                    <div className="text-center py-8 text-gray-400">
                      <div className="animate-pulse">Loading tickets...</div>
                    </div>
                  ) : tickets.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No support tickets found</p>
                      <p className="text-sm">Create a ticket using the Contact Us tab</p>
                    </div>
                  ) : (
                    tickets.map((ticket) => (
                      <motion.div
                        key={ticket.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card p-4 rounded-lg border border-gray-700"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="text-white font-semibold mb-1">{ticket.subject}</h4>
                            <p className="text-sm text-gray-400">
                              Created: {new Date(ticket.created_at).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {getPriorityBadge(ticket.priority)}
                            {getStatusBadge(ticket.status)}
                          </div>
                        </div>
                        
                        <div className="bg-gray-800/30 rounded-lg p-3 mb-3">
                          <p className="text-gray-300 text-sm">{ticket.message}</p>
                        </div>

                        {ticket.admin_response && (
                          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <Headphones className="w-4 h-4 text-blue-400" />
                              <span className="text-blue-400 font-medium text-sm">Support Response:</span>
                            </div>
                            <p className="text-gray-300 text-sm">{ticket.admin_response}</p>
                          </div>
                        )}
                      </motion.div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default HelpScreen;
