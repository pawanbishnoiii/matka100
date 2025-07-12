
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  MessageCircle, 
  Book, 
  Phone, 
  Mail, 
  Search,
  ChevronDown,
  ChevronUp,
  HelpCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HelpCenter } from '@/components/help/HelpCenter';

const HelpPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "How do I place a bet?",
      answer: "To place a bet, select a game, choose your numbers, set your bet amount, and confirm your bet before the game closes."
    },
    {
      question: "What are the different bet types?",
      answer: "We offer Single Ank (1x10), Jodi (1x90), Single Patti (1x140), Double Patti (1x280), and Triple Patti (1x600) betting options."
    },
    {
      question: "How do I withdraw my winnings?",
      answer: "Go to the Wallet section, click on Withdraw, enter the amount, and follow the verification process. Withdrawals are processed within 24 hours."
    },
    {
      question: "What is the minimum bet amount?",
      answer: "The minimum bet amount is ₹10 for all games. Maximum bet limits vary by game type."
    },
    {
      question: "How do game timings work?",
      answer: "Each game has specific opening and closing times. Betting stops 5 minutes before the result time. Check the Games section for exact timings."
    },
    {
      question: "How does the referral program work?",
      answer: "Invite friends using your referral code. You get ₹50 bonus when they sign up and 5% commission on their bets."
    }
  ];

  const contactMethods = [
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Available 24/7 for instant support",
      action: "Start Chat",
      color: "text-blue-400"
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "+91 9876543210",
      action: "Call Now",
      color: "text-green-400"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "support@matka100.com",
      action: "Send Email",
      color: "text-purple-400"
    }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 p-4">
      {/* Header */}
      <motion.div
        className="flex items-center gap-4 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(-1)}
          className="border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-white">Help & Support</h1>
          <p className="text-gray-400">Get assistance with MATKA 100</p>
        </div>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        className="relative mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          placeholder="Search for help..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-gray-800/50 border-gray-600 text-white pl-10"
        />
      </motion.div>

      <Tabs defaultValue="faq" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-gray-800/50 border border-gray-700">
          <TabsTrigger value="faq" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600">
            <HelpCircle className="w-4 h-4 mr-2" />
            FAQ
          </TabsTrigger>
          <TabsTrigger value="contact" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600">
            <MessageCircle className="w-4 h-4 mr-2" />
            Contact
          </TabsTrigger>
          <TabsTrigger value="tickets" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600">
            <Book className="w-4 h-4 mr-2" />
            Support
          </TabsTrigger>
        </TabsList>

        <TabsContent value="faq">
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            {filteredFaqs.map((faq, index) => (
              <Card key={index} className="glass-card border-gray-700">
                <CardContent className="p-4">
                  <button
                    className="w-full flex items-center justify-between text-left"
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  >
                    <h3 className="text-white font-semibold">{faq.question}</h3>
                    {expandedFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  {expandedFaq === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mt-3 pt-3 border-t border-gray-600"
                    >
                      <p className="text-gray-300">{faq.answer}</p>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </TabsContent>

        <TabsContent value="contact">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {contactMethods.map((method, index) => (
              <Card key={index} className="glass-card border-gray-700 hover:border-gray-600 transition-colors">
                <CardContent className="p-6 text-center">
                  <method.icon className={`w-12 h-12 ${method.color} mx-auto mb-4`} />
                  <h3 className="text-white font-semibold mb-2">{method.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{method.description}</p>
                  <Button
                    variant="outline"
                    className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    {method.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </TabsContent>

        <TabsContent value="tickets">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <HelpCenter />
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HelpPage;
