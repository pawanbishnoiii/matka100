
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Shield, RefreshCw, Cookie, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';

interface LegalPage {
  id: string;
  page_type: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

const legalPageTypes = {
  privacy: { icon: Shield, title: 'Privacy Policy', color: 'text-blue-400' },
  terms: { icon: FileText, title: 'Terms & Conditions', color: 'text-green-400' },
  refund: { icon: RefreshCw, title: 'Refund Policy', color: 'text-yellow-400' },
  cookies: { icon: Cookie, title: 'Cookie Policy', color: 'text-purple-400' }
};

export const LegalPagesViewer = () => {
  const [legalPages, setLegalPages] = useState<LegalPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState<LegalPage | null>(null);

  useEffect(() => {
    fetchLegalPages();
  }, []);

  const fetchLegalPages = async () => {
    try {
      const { data, error } = await supabase
        .from('legal_pages')
        .select('*')
        .order('page_type');

      if (error) throw error;
      setLegalPages(data || []);
    } catch (error) {
      console.error('Error fetching legal pages:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {Object.entries(legalPageTypes).map(([type, config]) => {
          const page = legalPages.find(p => p.page_type === type);
          const Icon = config.icon;
          
          return (
            <Dialog key={type}>
              <DialogTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="cursor-pointer"
                >
                  <Card className="glass-card border-gray-700 hover:border-purple-500 transition-all duration-300">
                    <CardContent className="p-6 text-center">
                      <Icon className={`w-8 h-8 mx-auto mb-3 ${config.color}`} />
                      <h3 className="text-white font-semibold text-sm">{config.title}</h3>
                      {page && (
                        <p className="text-gray-400 text-xs mt-2">
                          Updated: {new Date(page.updated_at).toLocaleDateString()}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </DialogTrigger>
              <DialogContent className="glass-card border-gray-700 max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-white flex items-center gap-2">
                    <Icon className={`w-5 h-5 ${config.color}`} />
                    {config.title}
                  </DialogTitle>
                </DialogHeader>
                <div className="prose prose-invert max-w-none">
                  <div 
                    className="text-gray-300 leading-relaxed whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ 
                      __html: page?.content || `${config.title} content will be available soon.` 
                    }}
                  />
                </div>
              </DialogContent>
            </Dialog>
          );
        })}
      </motion.div>
    </div>
  );
};
