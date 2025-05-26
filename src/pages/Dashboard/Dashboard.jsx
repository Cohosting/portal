import React from 'react'
import { Layout } from './Layout'
import { useSelector } from 'react-redux';
import { supabase } from '../../lib/supabase';
import { useState, useEffect } from 'react'
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
} from 'lucide-react'
import InvoiceReminder from '../../components/Modal/InvoiceReminder';
import { useNavigate } from 'react-router-dom';
import useRecentActivities from '../../hooks/react-query/useRecentActivities';
import moment from 'moment';
import { usePortalData } from '../../hooks/react-query/usePortalData';
import { Spinner } from '@phosphor-icons/react';
import PageHeader from '@/components/internal/PageHeader';
import DashboardSkeleton from '@/components/SkeletonLoading';

export const Dashboard = () => {
  const navigate = useNavigate()
  const { currentSelectedPortal } = useSelector(state => state.auth)
  const { data: recentActivities } = useRecentActivities(currentSelectedPortal)
  const { data: portal, isLoading: isPortalLoading } = usePortalData(currentSelectedPortal)
  const [summary, setSummary] = useState({
    total_clients: { value: 0, change: 0 },
    total_invoices: { value: 0, change: 0 },
    total_revenue: { value: 0, change: 0 },
    open_invoices: { value: 0, change: 0 },
    paid_invoices_percentage: { value: 0, change: 0 }
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!currentSelectedPortal) return
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
      console.log({
        data
      })
    };

    fetchSummary();
  }, [currentSelectedPortal]);

  const { user } = useSelector(state => state.auth);

  const formatChange = (change, isPercentage = false) => {
    const prefix = change >= 0 ? '+' : '';
    return `${prefix}${change}${isPercentage ? '%' : ''} from last month`;
  };

  // Define icon colors and backgrounds for each card
  const cardStyles = {
    'Total Clients': { iconBg: 'bg-blue-50', iconColor: 'text-blue-600' },
    'Total Invoices': { iconBg: 'bg-indigo-50', iconColor: 'text-indigo-600' },
    'Total Revenue': { iconBg: 'bg-green-50', iconColor: 'text-green-600' },
    'Open Invoices': { iconBg: 'bg-amber-50', iconColor: 'text-amber-600' }
  };

  // Get status badge styling based on change value
  const getChangeBadgeStyle = (change) => {
    if (change > 0) return 'bg-green-50 text-green-600';
    if (change < 0) return 'bg-red-50 text-red-600';
    return 'bg-gray-50 text-gray-600';
  };

  const summaryItems = [
    { title: 'Total Clients', value: summary.total_clients.value, icon: Users, change: formatChange(summary.total_clients.change), rawChange: summary.total_clients.change },
    { title: 'Total Invoices', value: summary.total_invoices.value, icon: FileText, change: formatChange(summary.total_invoices.change), rawChange: summary.total_invoices.change },
    { title: 'Total Revenue', value: `${summary.total_revenue.value}`, icon: DollarSign, change: formatChange(summary.total_revenue.change, true), rawChange: summary.total_revenue.change },
    { title: 'Open Invoices', value: summary.open_invoices.value, icon: AlertCircle, change: formatChange(summary.open_invoices.change), rawChange: summary.open_invoices.change },
  ];

  if (isPortalLoading) return  <DashboardSkeleton />

  return (
    <Layout hideMobileNav user={user}>
      <PageHeader
        title="Dashboard"
        description="Overview of your portal's performance and recent activities."
      />
      <div className="space-y-6   p-6">
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

        {/* Redesigned Recent Activities section */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
  <div className="col-span-4">
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
      <div className="p-5 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Recent Activities</h2>
        </div>
      </div>
      
      <div className="divide-y divide-gray-100 flex-grow">
        {recentActivities?.length > 0 ? (
          recentActivities.map((activity) => (
            <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-3">
                  <div className="p-2 bg-indigo-50 rounded-full">
                    <FileText className="h-5 w-5 text-indigo-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.title}
                    </p>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      Draft
                    </span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="flex-shrink-0 mr-1.5 h-3.5 w-3.5 text-gray-400" />
                    <span>{moment(activity.created_at).fromNow()}</span>
                  </div>
                </div>
                <button className="ml-4 p-1.5 rounded-full hover:bg-gray-200 transition-colors">
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 flex-grow">
            <AlertCircle className="h-10 w-10 text-gray-300 mb-3" />
            <p className="text-sm text-gray-500">No recent activities</p>
          </div>
        )}
      </div>
    </div>
  </div>
  <div className="col-span-3">
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 h-full flex flex-col">
      <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
      <div className="space-y-3 flex-grow flex flex-col justify-between">
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
}