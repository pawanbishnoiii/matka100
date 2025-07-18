import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, Info, AlertTriangle, CheckCircle, Settings, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

interface NotificationPreferences {
  email_notifications: boolean;
  push_notifications: boolean;
  sms_notifications: boolean;
  game_results: boolean;
  payment_updates: boolean;
  promotional: boolean;
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('notifications');
  const [filterType, setFilterType] = useState('all');
  const [unreadCount, setUnreadCount] = useState(0);
  
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user && isOpen) {
      fetchNotifications();
      fetchPreferences();
    }
  }, [user, isOpen]);

  useEffect(() => {
    const unread = notifications.filter(n => !n.is_read).length;
    setUnreadCount(unread);
  }, [notifications]);

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPreferences = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setPreferences(data);
      } else {
        // Create default preferences
        const defaultPrefs = {
          email_notifications: true,
          push_notifications: true,
          sms_notifications: false,
          game_results: true,
          payment_updates: true,
          promotional: false
        };
        
        const { error: insertError } = await supabase
          .from('user_notification_preferences')
          .insert({ user_id: user.id, ...defaultPrefs });
          
        if (!insertError) {
          setPreferences(defaultPrefs);
        }
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user?.id)
        .eq('is_read', false);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(n => ({ ...n, is_read: true }))
      );

      toast({
        title: 'Success',
        description: 'All notifications marked as read',
      });
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast({
        title: 'Error',
        description: 'Failed to mark notifications as read',
        variant: 'destructive',
      });
    }
  };

  const updatePreferences = async (newPreferences: Partial<NotificationPreferences>) => {
    if (!user || !preferences) return;

    try {
      const updatedPrefs = { ...preferences, ...newPreferences };
      
      const { error } = await supabase
        .from('user_notification_preferences')
        .update(updatedPrefs)
        .eq('user_id', user.id);

      if (error) throw error;

      setPreferences(updatedPrefs);
      
      toast({
        title: 'Preferences Updated',
        description: 'Your notification preferences have been saved',
      });
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast({
        title: 'Error',
        description: 'Failed to update preferences',
        variant: 'destructive',
      });
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'error':
        return <X className="w-5 h-5 text-red-400" />;
      default:
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filterType === 'all') return true;
    if (filterType === 'unread') return !notification.is_read;
    return notification.type === filterType;
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gaming-card border-gaming-border rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b border-gaming-border">
            <div className="flex items-center gap-3">
              <Bell className="w-6 h-6 text-gaming-primary" />
              <div>
                <h2 className="text-xl font-bold text-white">Notifications</h2>
                <p className="text-gaming-text-secondary text-sm">
                  {unreadCount} unread notifications
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTab(activeTab === 'notifications' ? 'settings' : 'notifications')}
                className="border-gaming-border text-gaming-text hover:bg-gaming-hover"
              >
                <Settings className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="border-gaming-border text-gaming-text hover:bg-gaming-hover"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="h-[60vh] overflow-y-auto">
            {activeTab === 'notifications' ? (
              <div className="p-6 space-y-4">
                {/* Filters */}
                <div className="flex justify-between items-center">
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-48 bg-gaming-input border-gaming-border text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gaming-card border-gaming-border">
                      <SelectItem value="all">All Notifications</SelectItem>
                      <SelectItem value="unread">Unread Only</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {unreadCount > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={markAllAsRead}
                      className="border-gaming-accent text-gaming-accent hover:bg-gaming-accent hover:text-black"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Mark All Read
                    </Button>
                  )}
                </div>

                {/* Notifications List */}
                <div className="space-y-3">
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-pulse text-gaming-text-secondary">Loading notifications...</div>
                    </div>
                  ) : filteredNotifications.length === 0 ? (
                    <div className="text-center py-8">
                      <Bell className="w-16 h-16 text-gaming-text-secondary mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-semibold text-white mb-2">No Notifications</h3>
                      <p className="text-gaming-text-secondary">You're all caught up!</p>
                    </div>
                  ) : (
                    filteredNotifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          notification.is_read 
                            ? 'border-gaming-border bg-gaming-darker/50' 
                            : 'border-gaming-accent/30 bg-gaming-accent/5'
                        }`}
                        onClick={() => !notification.is_read && markAsRead(notification.id)}
                      >
                        <div className="flex items-start gap-3">
                          {getNotificationIcon(notification.type)}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-semibold text-white truncate">
                                {notification.title}
                              </h4>
                              <div className="flex items-center gap-2">
                                {!notification.is_read && (
                                  <Badge className="bg-gaming-primary text-black">New</Badge>
                                )}
                                <span className="text-xs text-gaming-text-secondary">
                                  {new Date(notification.created_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <p className="text-gaming-text-secondary text-sm">
                              {notification.message}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            ) : (
              <div className="p-6 space-y-6">
                <h3 className="text-lg font-semibold text-white">Notification Preferences</h3>
                
                {preferences && (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <h4 className="font-medium text-gaming-text">Delivery Methods</h4>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="email" className="text-gaming-text-secondary">
                          Email Notifications
                        </Label>
                        <Switch
                          id="email"
                          checked={preferences.email_notifications}
                          onCheckedChange={(checked) => 
                            updatePreferences({ email_notifications: checked })
                          }
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="push" className="text-gaming-text-secondary">
                          Push Notifications
                        </Label>
                        <Switch
                          id="push"
                          checked={preferences.push_notifications}
                          onCheckedChange={(checked) => 
                            updatePreferences({ push_notifications: checked })
                          }
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="sms" className="text-gaming-text-secondary">
                          SMS Notifications
                        </Label>
                        <Switch
                          id="sms"
                          checked={preferences.sms_notifications}
                          onCheckedChange={(checked) => 
                            updatePreferences({ sms_notifications: checked })
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium text-gaming-text">Notification Types</h4>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="gameResults" className="text-gaming-text-secondary">
                          Game Results
                        </Label>
                        <Switch
                          id="gameResults"
                          checked={preferences.game_results}
                          onCheckedChange={(checked) => 
                            updatePreferences({ game_results: checked })
                          }
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="paymentUpdates" className="text-gaming-text-secondary">
                          Payment Updates
                        </Label>
                        <Switch
                          id="paymentUpdates"
                          checked={preferences.payment_updates}
                          onCheckedChange={(checked) => 
                            updatePreferences({ payment_updates: checked })
                          }
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="promotional" className="text-gaming-text-secondary">
                          Promotional Offers
                        </Label>
                        <Switch
                          id="promotional"
                          checked={preferences.promotional}
                          onCheckedChange={(checked) => 
                            updatePreferences({ promotional: checked })
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NotificationCenter;