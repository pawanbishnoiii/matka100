
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, Settings, Database, Bell, Receipt } from 'lucide-react';
import { AdminPaymentGateway } from './AdminPaymentGateway';
import { AdminRazorpayPayments } from './AdminRazorpayPayments';

export const AdminSettingsManager = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-8 h-8 text-purple-400" />
        <div>
          <h2 className="text-2xl font-bold text-white">System Settings</h2>
          <p className="text-gray-400">Configure system-wide settings and integrations</p>
        </div>
      </div>

      <Tabs defaultValue="payments" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 glass-card p-1">
          <TabsTrigger value="payments" className="data-[state=active]:bg-blue-600 text-white">
            <CreditCard className="w-4 h-4 mr-2" />
            Payment Gateway
          </TabsTrigger>
          <TabsTrigger value="razorpay-payments" className="data-[state=active]:bg-green-600 text-white">
            <Receipt className="w-4 h-4 mr-2" />
            Razorpay Payments
          </TabsTrigger>
          <TabsTrigger value="general" className="data-[state=active]:bg-yellow-600 text-white">
            <Settings className="w-4 h-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="database" className="data-[state=active]:bg-purple-600 text-white">
            <Database className="w-4 h-4 mr-2" />
            Database
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-red-600 text-white">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="payments">
          <AdminPaymentGateway />
        </TabsContent>

        <TabsContent value="razorpay-payments">
          <AdminRazorpayPayments />
        </TabsContent>

        <TabsContent value="general">
          <div className="glass-card border-gray-700 p-6">
            <h3 className="text-xl font-semibold text-white mb-4">General Settings</h3>
            <p className="text-gray-400">General system configuration options will be added here.</p>
          </div>
        </TabsContent>

        <TabsContent value="database">
          <div className="glass-card border-gray-700 p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Database Settings</h3>
            <p className="text-gray-400">Database configuration and maintenance options will be added here.</p>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <div className="glass-card border-gray-700 p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Notification Settings</h3>
            <p className="text-gray-400">Notification system configuration will be added here.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
