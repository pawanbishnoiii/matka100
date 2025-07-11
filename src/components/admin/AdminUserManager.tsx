
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Users,
  Eye,
  Ban,
  UserCheck,
  Wallet,
  CreditCard,
  Shield,
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';

interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  balance_inr: number;
  balance_gbp: number;
  status: string;
  kyc_status: string;
  referral_code: string;
  is_admin: boolean;
  created_at: string;
}

interface AdminUserManagerProps {
  onStatsUpdate: () => void;
}

export const AdminUserManager = ({ onStatsUpdate }: AdminUserManagerProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [balanceAmount, setBalanceAmount] = useState('');
  const [balanceType, setBalanceType] = useState<'add' | 'deduct'>('add');
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch users',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUserStatus = async (userId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ status: newStatus })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `User status updated to ${newStatus}`,
      });
      fetchUsers();
      onStatsUpdate();
    } catch (error) {
      console.error('Error updating user status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user status',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateKycStatus = async (userId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ kyc_status: newStatus })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `KYC status updated to ${newStatus}`,
      });
      fetchUsers();
      onStatsUpdate();
    } catch (error) {
      console.error('Error updating KYC status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update KYC status',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateBalance = async () => {
    if (!selectedUser || !balanceAmount) return;

    try {
      const amount = parseFloat(balanceAmount);
      const finalAmount = balanceType === 'add' ? amount : -amount;

      const { error } = await supabase.rpc('update_user_balance', {
        user_uuid: selectedUser.id,
        amount: finalAmount,
        currency: 'INR'
      });

      if (error) throw error;

      // Create transaction record
      await supabase.from('transactions').insert({
        user_id: selectedUser.id,
        type: balanceType === 'add' ? 'bonus' : 'withdrawal',
        amount: Math.abs(finalAmount),
        currency: 'INR',
        status: 'completed',
        description: `Admin ${balanceType === 'add' ? 'added' : 'deducted'} balance`,
        metadata: { admin_action: true }
      });

      toast({
        title: 'Success',
        description: `Balance ${balanceType === 'add' ? 'added' : 'deducted'} successfully`,
      });
      fetchUsers();
      onStatsUpdate();
      setIsDialogOpen(false);
      setBalanceAmount('');
    } catch (error) {
      console.error('Error updating balance:', error);
      toast({
        title: 'Error',
        description: 'Failed to update balance',
        variant: 'destructive',
      });
    }
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone?.includes(searchTerm)
  );

  if (loading) {
    return (
      <Card className="glass-card border-gray-700">
        <CardContent className="p-8 text-center">
          <div className="animate-pulse text-white">Loading users...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white hindi-font flex items-center gap-2">
          <Users className="w-6 h-6 text-green-400" />
          User Management Dashboard
        </CardTitle>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-600 text-white"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-4 rounded-lg border border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
                    {user.is_admin ? (
                      <Shield className="w-6 h-6 text-white" />
                    ) : (
                      <Users className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-white">{user.name || 'No Name'}</h3>
                      {user.is_admin && (
                        <span className="px-2 py-1 bg-purple-600/20 text-purple-400 text-xs rounded">
                          ADMIN
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400">{user.email}</p>
                    <p className="text-sm text-gray-500">{user.phone || 'No phone'}</p>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-white font-bold">₹{user.balance_inr?.toLocaleString() || '0'}</p>
                  <p className="text-gray-400 text-sm">Balance</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    user.status === 'active'
                      ? 'bg-green-600/20 text-green-400'
                      : user.status === 'suspended'
                      ? 'bg-yellow-600/20 text-yellow-400'
                      : 'bg-red-600/20 text-red-400'
                  }`}>
                    {user.status?.toUpperCase() || 'UNKNOWN'}
                  </div>

                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    user.kyc_status === 'approved'
                      ? 'bg-green-600/20 text-green-400'
                      : user.kyc_status === 'rejected'
                      ? 'bg-red-600/20 text-red-400'
                      : 'bg-yellow-600/20 text-yellow-400'
                  }`}>
                    KYC: {user.kyc_status?.toUpperCase() || 'PENDING'}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedUser(user);
                        setIsDialogOpen(true);
                      }}
                      className="border-gray-600 text-white hover:bg-gray-700"
                    >
                      <Wallet className="w-4 h-4" />
                    </Button>

                    {user.kyc_status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleUpdateKycStatus(user.id, 'approved')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleUpdateKycStatus(user.id, 'rejected')}
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </>
                    )}

                    {!user.is_admin && (
                      <Button
                        size="sm"
                        variant={user.status === 'active' ? 'destructive' : 'default'}
                        onClick={() => handleUpdateUserStatus(
                          user.id,
                          user.status === 'active' ? 'suspended' : 'active'
                        )}
                      >
                        {user.status === 'active' ? (
                          <Ban className="w-4 h-4" />
                        ) : (
                          <UserCheck className="w-4 h-4" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Balance Management Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="glass-card border-gray-700 text-white">
            <DialogHeader>
              <DialogTitle>
                Manage Balance - {selectedUser?.name || selectedUser?.email}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Current Balance</Label>
                <p className="text-2xl font-bold text-green-400">
                  ₹{selectedUser?.balance_inr?.toLocaleString() || '0'}
                </p>
              </div>

              <div>
                <Label>Action</Label>
                <Select value={balanceType} onValueChange={(value: 'add' | 'deduct') => setBalanceType(value)}>
                  <SelectTrigger className="bg-gray-800 border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="add">Add Balance</SelectItem>
                    <SelectItem value="deduct">Deduct Balance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Amount</Label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={balanceAmount}
                  onChange={(e) => setBalanceAmount(e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => {
                  setIsDialogOpen(false);
                  setBalanceAmount('');
                }}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleUpdateBalance}
                  className={balanceType === 'add' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
                >
                  {balanceType === 'add' ? 'Add' : 'Deduct'} Balance
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
