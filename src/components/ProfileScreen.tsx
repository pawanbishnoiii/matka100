
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const ProfileScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Immediately redirect to the enhanced profile page
  React.useEffect(() => {
    if (user) {
      navigate('/profile');
    } else {
      navigate('/auth');
    }
  }, [user, navigate]);

  return null; // Component doesn't render anything, just redirects
};

export default ProfileScreen;
