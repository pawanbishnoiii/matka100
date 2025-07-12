
import { motion } from 'framer-motion';
import { ArrowLeft, Home } from 'lucide-react';
import ResultsScreen from '../components/ResultsScreen';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';

const ResultsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-card border-b border-gray-700/50 p-4 mb-6"
      >
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.history.back()}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white hindi-font">Results & History</h1>
              <p className="text-sm text-gray-400">View game results & transaction history</p>
            </div>
          </div>
          
          {/* Home Button */}
          <Button 
            variant="outline"
            size="sm"
            onClick={() => navigate('/')}
            className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
        </div>
      </motion.header>

      {/* Results Content */}
      <div className="container mx-auto px-4">
        <ResultsScreen />
      </div>

      {/* Bottom Padding for Mobile Navigation */}
      <div className="h-20 md:h-0"></div>
    </div>
  );
};

export default ResultsPage;
