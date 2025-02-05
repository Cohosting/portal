import React from 'react'
import { Layout } from './Layout'
import { useSelector } from 'react-redux';
import { supabase } from '../../lib/supabase';
import { useState, useEffect } from 'react'
import {
  UserGroupIcon, DocumentTextIcon, CurrencyDollarIcon, ExclamationCircleIcon,
  PlusCircleIcon, PaperAirplaneIcon, ArrowPathIcon, CogIcon
} from '@heroicons/react/24/outline'
import InvoiceReminder from '../../components/Modal/InvoiceReminder';
import { useNavigate } from 'react-router-dom';
import useRecentActivities from '../../hooks/react-query/useRecentActivities';
import { formatDate } from '../../utils/dateUtils';
import moment from 'moment';
import { usePortalData } from '../../hooks/react-query/usePortalData';
import { Spinner } from '@phosphor-icons/react';

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

  const summaryItems = [
    { title: 'Total Clients', value: summary.total_clients.value, icon: UserGroupIcon, change: formatChange(summary.total_clients.change) },
    { title: 'Total Invoices', value: summary.total_invoices.value, icon: DocumentTextIcon, change: formatChange(summary.total_invoices.change) },
    { title: 'Total Revenue', value: `$${summary.total_revenue.value}`, icon: CurrencyDollarIcon, change: formatChange(summary.total_revenue.change, true) },
    { title: 'Open Invoices', value: summary.open_invoices.value, icon: ExclamationCircleIcon, change: formatChange(summary.open_invoices.change) },
  ];

  if (isPortalLoading) return <Layout user={user} > <Spinner /> </Layout>

  return (
    <Layout user={user}>
      <div className="space-y-6 max-w-7xl p-6">
        <p className='text-2xl font-bold'>Dashboard</p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {summaryItems?.map((item, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500">{item.title}</h3>
                <item.icon className="h-5 w-5 text-gray-400" />
              </div>
              <div className="text-2xl font-bold">{item.value}</div>
              <p className="text-xs text-gray-500">{item.change}</p>
            </div>
          ))}
        </div>

        {/* Rest of the component remains the same */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="bg-white rounded-lg shadow p-6 col-span-4">
            <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
            <ul className="space-y-4 h-full">
              {recentActivities?.map((activity) => (
                <li key={activity.id} className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-gray-500"> {moment(activity.created_at).fromNow()}</p>
                  </div>
                </li>
              ))}
              {
                !recentActivities?.length && (
                  <div className="flex h-full  mt-[55px] justify-center">
                    <ExclamationCircleIcon className="h-5 w-5 text-gray-400" />
                    <p className="text-md ml-2 text-gray-500">
                      {/* icon */}
                      No recent activities
                    </p>
                  </div>
                )
              }
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow p-6 col-span-3">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-4">
              {[
                { title: 'Create New Invoice', icon: PlusCircleIcon, onClick: () => navigate('/billing/add') },
                { title: 'Send Invoice Reminders', icon: PaperAirplaneIcon, onClick: () => setIsOpen(true) },

                { title: 'Invoice Settings', icon: CogIcon, onClick: () => navigate('/settings/portal') },
              ].map((action, index) => (
                <button
                  onClick={action.onClick}
                  key={index}
                  className="w-full flex items-center justify-start px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <action.icon className="mr-3 h-5 w-5 text-gray-400" />
                  {action.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Invoice Payment Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">Paid Invoices</p>
                <p className="text-xs text-gray-500">{summary.paid_invoices_percentage.value}% of total invoices</p>
              </div>
              <span className="text-sm font-bold">{summary.paid_invoices_percentage.value}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${summary.paid_invoices_percentage.value}%` }}></div>
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