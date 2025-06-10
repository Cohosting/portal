import React, { useState, useEffect } from 'react';
import { Layout } from './Layout';
import { useSelector } from 'react-redux';
import { supabase } from '../../lib/supabase';
import {
  Users,
  FileText,
  DollarSign,
  AlertCircle,
  PlusCircle,
  Send,
  Settings,
  Clock,
  ChevronRight
} from 'lucide-react';
import InvoiceReminder from '../../components/Modal/InvoiceReminder';
import { useNavigate } from 'react-router-dom';
import useRecentActivities from '../../hooks/react-query/useRecentActivities';
import { usePortalData } from '../../hooks/react-query/usePortalData';
import PageHeader from '@/components/internal/PageHeader';
import DashboardSkeleton from '@/components/SkeletonLoading';
import { DateTime } from 'luxon';
import RecentActivitiesList from '@/components/RecentActivities';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { currentSelectedPortal } = useSelector(state => state.auth);
 
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
    if (!currentSelectedPortal) return;
    const fetchSummary = async () => {
      const { data, error } = await supabase.rpc('generate_monthly_report', {
        report_date: new Date().toISOString(),
        input_portal_id: currentSelectedPortal
      });
      if (error) {
        console.error('Error fetching summary:', error);
      } else {
        setSummary(data);
      }
    };

    fetchSummary();
  }, [currentSelectedPortal]);

  const { user } = useSelector(state => state.auth);

  const formatChange = (change, isPercentage = false) => {
    const prefix = change >= 0 ? '+' : '';
    return `${prefix}${change}${isPercentage ? '%' : ''} from last month`;
  };

  const cardStyles = {
    'Total Clients': { iconBg: 'bg-blue-50', iconColor: 'text-blue-600' },
    'Total Invoices': { iconBg: 'bg-indigo-50', iconColor: 'text-indigo-600' },
    'Total Revenue': { iconBg: 'bg-green-50', iconColor: 'text-green-600' },
    'Open Invoices': { iconBg: 'bg-amber-50', iconColor: 'text-amber-600' }
  };

  const getChangeBadgeStyle = (change) => {
    if (change > 0) return 'bg-green-50 text-green-600';
    if (change < 0) return 'bg-red-50 text-red-600';
    return 'bg-gray-50 text-gray-600';
  };

  const summaryItems = [
    { title: 'Total Clients', value: summary.total_clients.value, icon: Users, change: formatChange(summary.total_clients.change), rawChange: summary.total_clients.change },
    { title: 'Total Invoices', value: summary.total_invoices.value, icon: FileText, change: formatChange(summary.total_invoices.change), rawChange: summary.total_invoices.change },
    { title: 'Total Revenue', value: `${summary.total_revenue.value}$`, icon: DollarSign, change: formatChange(summary.total_revenue.change, true), rawChange: summary.total_revenue.change },
    { title: 'Open Invoices', value: summary.open_invoices.value, icon: AlertCircle, change: formatChange(summary.open_invoices.change), rawChange: summary.open_invoices.change },
  ];

  if (isPortalLoading) return <DashboardSkeleton />;

  return (
    <Layout hideMobileNav user={user}>
      <PageHeader
        title="Dashboard"
        description="Overview of your portal's performance and recent activities."
      />
      <div className="space-y-6 p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {summaryItems?.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 transition-all hover:shadow-md"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-500">{item.title}</h3>
                <div className={`p-2 ${cardStyles[item.title].iconBg} rounded-full`}>
                  <item.icon className={`h-5 w-5 ${cardStyles[item.title].iconColor}`} />
                </div>
              </div>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold text-gray-900">{item.value}</span>
                <span className={`ml-2 text-xs px-2 py-1 ${getChangeBadgeStyle(item.rawChange)} rounded-full font-medium`}>
                  {item.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
              <div className="p-5 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-800">Recent Activities</h2>
                </div>
              </div>

              {/* Updated section: Scrollable Recent Activities */}
              <div className="divide-y divide-gray-100 overflow-y-auto max-h-100">
                   <RecentActivitiesList portal_id={currentSelectedPortal} />
               
              </div>
            </div>
          </div>

          {/* Quick Actions Column */}
          <div className="col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 flex flex-col">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-3 flex-grow flex flex-col">
                {[
                  { title: 'Create New Invoice', icon: PlusCircle, onClick: () => navigate('/billing/add'), color: 'bg-green-50 text-green-600' },
                  { title: 'Send Invoice Reminders', icon: Send, onClick: () => setIsOpen(true), color: 'bg-blue-50 text-blue-600' },
                  { title: 'Invoice Settings', icon: Settings, onClick: () => navigate('/settings/portal'), color: 'bg-gray-50 text-gray-600' },
                ].map((action, index) => (
                  <button
                    onClick={action.onClick}
                    key={index}
                    className="w-full flex items-center justify-between px-4 py-3 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <div className="flex items-center">
                      <div className={`p-2 rounded-full mr-3 ${action.color}`}>
                        <action.icon className="h-5 w-5" />
                      </div>
                      {action.title}
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Invoice Payment Status</h2>
          </div>
          <div className="p-5">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-700">Paid Invoices</p>
                  <p className="text-xs text-gray-500">{summary.paid_invoices_percentage.value}% of total invoices</p>
                </div>
                <span className="text-sm font-bold px-3 py-1 bg-blue-50 text-blue-600 rounded-full">{summary.paid_invoices_percentage.value}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${summary.paid_invoices_percentage.value}%` }}></div>
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
