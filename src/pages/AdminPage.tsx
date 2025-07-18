
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import ComprehensiveAdminPanel from '@/components/admin/ComprehensiveAdminPanel';

const AdminPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="animate-pulse text-white text-xl">Loading admin panel...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <ComprehensiveAdminPanel />;
};

export default AdminPage;
