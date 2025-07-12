
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  ArrowLeft,
  Download,
  Calendar,
  TrendingUp,
  BarChart3,
  PieChart as PieChartIcon
} from 'lucide-react';

interface GameResult {
  id: string;
  winning_number: number;
  result_date: string;
  total_amount: number;
  total_bets: number;
}

interface Game {
  id: string;
  name: string;
}

const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'];

export const GameCharts = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [game, setGame] = useState<Game | null>(null);
  const [results, setResults] = useState<GameResult[]>([]);
  const [timeRange, setTimeRange] = useState('30');
  const [chartType, setChartType] = useState('line');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (gameId) {
      fetchGameData();
      fetchResults();
    }
  }, [gameId, timeRange]);

  const fetchGameData = async () => {
    try {
      const { data, error } = await supabase
        .from('games')
        .select('id, name')
        .eq('id', gameId)
        .single();

      if (error) throw error;
      setGame(data);
    } catch (error) {
      console.error('Error fetching game:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch game data',
        variant: 'destructive',
      });
    }
  };

  const fetchResults = async () => {
    try {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - parseInt(timeRange));

      const { data, error } = await supabase
        .from('results')
        .select('*')
        .eq('game_id', gameId)
        .gte('result_date', daysAgo.toISOString().split('T')[0])
        .order('result_date', { ascending: true });

      if (error) throw error;
      setResults(data || []);
    } catch (error) {
      console.error('Error fetching results:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch chart data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadChart = async () => {
    try {
      const csvContent = [
        ['Date', 'Winning Number', 'Total Bets', 'Total Amount'],
        ...results.map(result => [
          result.result_date,
          result.winning_number,
          result.total_bets,
          result.total_amount
        ])
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${game?.name || 'game'}-chart-data.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: 'Success',
        description: 'Chart data downloaded successfully',
      });
    } catch (error) {
      console.error('Error downloading chart:', error);
      toast({
        title: 'Error',
        description: 'Failed to download chart data',
        variant: 'destructive',
      });
    }
  };

  const chartData = results.map(result => ({
    date: new Date(result.result_date).toLocaleDateString(),
    number: result.winning_number,
    bets: result.total_bets,
    amount: result.total_amount
  }));

  const numberFrequency = results.reduce((acc, result) => {
    acc[result.winning_number] = (acc[result.winning_number] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const pieData = Object.entries(numberFrequency).map(([number, count]) => ({
    name: `Number ${number}`,
    value: count,
    number: parseInt(number)
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="animate-pulse text-white text-xl">Loading charts...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/game/${gameId}`)}
              className="border-gray-600 text-white hover:bg-gray-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Game
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">
                {game?.name} Charts
              </h1>
              <p className="text-gray-400">Historical data and analysis</p>
            </div>
          </div>
          
          <Button
            onClick={downloadChart}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Data
          </Button>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div>
            <label className="text-gray-300 text-sm block mb-2">Time Range</label>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 3 months</SelectItem>
                <SelectItem value="180">Last 6 months</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-gray-300 text-sm block mb-2">Chart Type</label>
            <Select value={chartType} onValueChange={setChartType}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="line">Line Chart</SelectItem>
                <SelectItem value="bar">Bar Chart</SelectItem>
                <SelectItem value="pie">Number Frequency</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="glass-card border-gray-700 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                {chartType === 'line' && <TrendingUp className="w-5 h-5" />}
                {chartType === 'bar' && <BarChart3 className="w-5 h-5" />}
                {chartType === 'pie' && <PieChartIcon className="w-5 h-5" />}
                {chartType === 'line' && 'Winning Numbers Trend'}
                {chartType === 'bar' && 'Betting Volume'}
                {chartType === 'pie' && 'Number Frequency Distribution'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === 'line' && (
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="date" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#fff'
                        }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="number" 
                        stroke="#10B981" 
                        strokeWidth={3}
                        dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
                      />
                    </LineChart>
                  )}
                  
                  {chartType === 'bar' && (
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="date" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#fff'
                        }} 
                      />
                      <Bar dataKey="amount" fill="#3B82F6" />
                    </BarChart>
                  )}
                  
                  {chartType === 'pie' && (
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#fff'
                        }} 
                      />
                    </PieChart>
                  )}
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="glass-card border-gray-700">
            <CardContent className="p-6 text-center">
              <p className="text-gray-400 text-sm mb-2">Total Results</p>
              <p className="text-3xl font-bold text-white">{results.length}</p>
            </CardContent>
          </Card>
          
          <Card className="glass-card border-gray-700">
            <CardContent className="p-6 text-center">
              <p className="text-gray-400 text-sm mb-2">Most Frequent</p>
              <p className="text-3xl font-bold text-yellow-400">
                {pieData.length > 0 ? pieData.reduce((max, item) => max.value > item.value ? max : item).number : 'N/A'}
              </p>
            </CardContent>
          </Card>
          
          <Card className="glass-card border-gray-700">
            <CardContent className="p-6 text-center">
              <p className="text-gray-400 text-sm mb-2">Total Volume</p>
              <p className="text-3xl font-bold text-green-400">
                ₹{results.reduce((sum, r) => sum + (r.total_amount || 0), 0).toLocaleString()}
              </p>
            </CardContent>
          </Card>
          
          <Card className="glass-card border-gray-700">
            <CardContent className="p-6 text-center">
              <p className="text-gray-400 text-sm mb-2">Total Bets</p>
              <p className="text-3xl font-bold text-blue-400">
                {results.reduce((sum, r) => sum + (r.total_bets || 0), 0).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Results Table */}
        <Card className="glass-card border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Recent Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left p-3 text-gray-300">Date</th>
                    <th className="text-left p-3 text-gray-300">Winning Number</th>
                    <th className="text-left p-3 text-gray-300">Total Bets</th>
                    <th className="text-left p-3 text-gray-300">Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {results.slice(-10).reverse().map((result) => (
                    <tr key={result.id} className="border-b border-gray-800">
                      <td className="p-3 text-gray-300">
                        {new Date(result.result_date).toLocaleDateString()}
                      </td>
                      <td className="p-3">
                        <Badge className="bg-yellow-500 text-black font-bold">
                          {result.winning_number}
                        </Badge>
                      </td>
                      <td className="p-3 text-white">{result.total_bets || 0}</td>
                      <td className="p-3 text-green-400">₹{(result.total_amount || 0).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
