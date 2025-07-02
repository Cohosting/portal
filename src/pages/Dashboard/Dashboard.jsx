import React, { useState, useEffect } from 'react';
import { Layout } from './Layout';
import { useSelector } from 'react-redux';
import { supabase } from '../../lib/supabase';
import {
  Users,
  ClipboardList,
  TrendingUp,
  Inbox,
  PlusCircle,
  Send,
  Settings,
  ChevronRight
} from 'lucide-react';
import InvoiceReminder from '../../components/Modal/InvoiceReminder';
import { useNavigate } from 'react-router-dom';
import { usePortalData } from '../../hooks/react-query/usePortalData';
import PageHeader from '@/components/internal/PageHeader';
import DashboardSkeleton from '@/components/SkeletonLoading';
import RecentActivitiesList from '@/components/RecentActivities';
import { Button } from '@/components/ui/button';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { currentSelectedPortal, user } = useSelector(state => state.auth);
  const { data: portal, isLoading: isPortalLoading } = usePortalData(currentSelectedPortal);

  const [summary, setSummary] = useState({
    total_clients: { value: 0, change: 0 },
    total_invoices: { value: 0, change: 0 },
    total_revenue: { value: 0, change: 0 },
    open_invoices: { value: 0, change: 0 },
    paid_invoices_percentage: { value: 0, change: 0 }
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    console.log('currentSelectedPortal', currentSelectedPortal);
    if (!currentSelectedPortal) return;
    supabase
      .rpc('generate_monthly_report', {
        report_date: new Date().toISOString(),
        input_portal_id: currentSelectedPortal
      })
      .then(({ data, error }) => {
        if (error) console.error(error);
        else setSummary(data);
      });
  }, [currentSelectedPortal]);

  const formatChange = (change, isPct = false) => {
    const prefix = change >= 0 ? '+' : '';
    return `${prefix}${isPct ? '$' : ''}${change} from last month`;
  };

  const cardStyles = {
    'Total Clients':  { iconBg: 'bg-gray-100', iconColor: 'text-gray-500' },
    'Total Invoices': { iconBg: 'bg-gray-100', iconColor: 'text-gray-500' },
    'Total Revenue':  { iconBg: 'bg-gray-100', iconColor: 'text-gray-500' },
    'Open Invoices':  { iconBg: 'bg-gray-100', iconColor: 'text-gray-500' }
  };
  const badgeStyle = 'bg-gray-100 text-gray-500';

  const summaryItems = [
    {
      title: 'Total Clients',
      value: summary.total_clients.value,
      icon: Users,
      delta: summary.total_clients.change,
      label: formatChange(summary.total_clients.change),
    },
    {
      title: 'Total Invoices',
      value: summary.total_invoices.value,
      icon: ClipboardList,
      delta: summary.total_invoices.change,
      label: formatChange(summary.total_invoices.change),
    },
    {
      title: 'Total Revenue',
      value: `${summary.total_revenue.value}$`,
      icon: TrendingUp,
      delta: summary.total_revenue.change,
      label: formatChange(summary.total_revenue.change, true),
    },
    {
      title: 'Open Invoices',
      value: summary.open_invoices.value,
      icon: Inbox,
      delta: summary.open_invoices.change,
      label: formatChange(summary.open_invoices.change),
    },
  ];

  if (isPortalLoading) return <DashboardSkeleton />;

  return (
    <Layout hideMobileNav user={user}>
      <PageHeader
        title="Dashboard"
        description="Overview of your portal's performance and recent activities."
      />

      <div className="px-6 max-sm:px-4 mt-4 py-1">
        <p className="text-xl text-gray-600">
          Hey, <span className="font-semibold text-gray-800">{user?.name}</span>! 👋 Welcome back.
        </p>
      </div>

      <div className="space-y-6 max-sm:px-4 p-6 pt-3">
        {/* Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {summaryItems.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-700">{item.title}</h3>
                <div className={`p-2 ${cardStyles[item.title].iconBg} rounded-full`}>
                  <item.icon className={`h-5 w-5 ${cardStyles[item.title].iconColor}`} />
                </div>
              </div>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold text-gray-900">{item.value}</span>
                <span
                  className={`ml-2 text-xs px-2 py-1 rounded-full font-medium ${
                    item.delta > 0
                      ? 'bg-green-100 text-green-800'
                      : badgeStyle
                  }`}
                >
                  {item.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activities & Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          {/* Recent Activities */}
          <div className="col-span-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800">Recent Activities</h2>
              </div>
              <div className="divide-y divide-gray-100">
                <RecentActivitiesList portal_id={currentSelectedPortal} />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 flex flex-col h-full">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
              <div className="flex flex-col space-y-3 flex-grow">
                {[
                  { title: 'Create New Invoice', icon: PlusCircle, onClick: () => navigate('/billing/add') },
                  { title: 'Send Invoice Reminders', icon: Send,    onClick: () => setIsOpen(true) },
                  { title: 'Invoice Settings',        icon: Settings, onClick: () => navigate('/settings/portal') }
                ].map((action, idx) => (
                  <Button
                    key={idx}
                    onClick={action.onClick}
                    className="w-full flex h-50 items-center justify-between px-4 py-3 border border-gray-200 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center">
                      <div className="p-2 rounded-full bg-gray-100 text-gray-500 mr-3">
                        <action.icon className="h-5 w-5" />
                      </div>
                      {action.title}
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Payment Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Invoice Payment Status</h2>
          </div>
          <div className="p-5">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">Paid Invoices</p>
                  <p className="text-xs text-gray-500">
                    {summary.paid_invoices_percentage.value}% of total invoices
                  </p>
                </div>
                <span className="text-sm font-bold px-3 py-1 bg-gray-100 text-gray-500 rounded-full">
                  {summary.paid_invoices_percentage.value}%
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div
                  className="bg-gray-500 h-2.5 rounded-full"
                  style={{ width: `${summary.paid_invoices_percentage.value}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <InvoiceReminder
        portal={portal}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </Layout>
  );
};
