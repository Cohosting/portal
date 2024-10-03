import React from 'react'
import { Layout } from './Layout'
import { TrialStatus } from '../../components/TrialStatus';
import { useSelector } from 'react-redux';
import { supabase } from '../../lib/supabase';
import { useState, useEffect } from 'react'
import {
  UserGroupIcon, DocumentTextIcon, CurrencyDollarIcon, ExclamationCircleIcon,
  PlusCircleIcon, PaperAirplaneIcon, ArrowPathIcon, CogIcon
} from '@heroicons/react/24/outline'

// Mock data - replace with actual API calls in a real application
const mockData = {
  totalClients: 25,
  totalInvoices: 150,
  totalRevenue: 75000,
  overdueInvoices: 5,
}

const recentActivities = [
  { id: 1, description: 'Invoice #1234 created for "Acme Corp"', time: '2 hours ago' },
  { id: 2, description: 'Payment received for Invoice #1122 from "XYZ Inc"', time: '1 day ago' },
  { id: 3, description: 'Reminder sent for overdue Invoice #0987 to "ABC Ltd"', time: '2 days ago' },
]

export const Dashboard = ({ children }) => {  
  const [data, setData] = useState(mockData)
  const [activities, setActivities] = useState(recentActivities)

  // Simulating data fetch - replace with actual API calls
  useEffect(() => {
    // Fetch dashboard data
    // setData(fetchedData)
    // Fetch recent activities
    // setActivities(fetchedActivities)
  }, [])
  const { user } = useSelector(state => state.auth)
  return (
    <Layout user={user}>
      <div className="space-y-6 max-w-7xl     p-6">
        <p className='text-2xl font-bold'>Dashboard</p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { title: 'Total Clients', value: data.totalClients, icon: UserGroupIcon, change: '+3 from last month' },
            { title: 'Total Invoices', value: data.totalInvoices, icon: DocumentTextIcon, change: '+15 from last month' },
            { title: 'Total Revenue', value: `$${data.totalRevenue.toLocaleString()}`, icon: CurrencyDollarIcon, change: '+8% from last month' },
            { title: 'Overdue Invoices', value: data.overdueInvoices, icon: ExclamationCircleIcon, change: '-2 from last month' },
          ].map((item, index) => (
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

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="bg-white rounded-lg shadow p-6 col-span-4">
            <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
            <ul className="space-y-4">
              {activities.map((activity) => (
                <li key={activity.id} className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow p-6 col-span-3">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-4">
              {[
                { title: 'Create New Invoice', icon: PlusCircleIcon },
                { title: 'Send Invoice Reminders', icon: PaperAirplaneIcon },
                { title: 'Generate Monthly Report', icon: ArrowPathIcon },
                { title: 'Invoice Settings', icon: CogIcon },
              ].map((action, index) => (
                <button
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
                <p className="text-xs text-gray-500">90% of total invoices</p>
              </div>
              <span className="text-sm font-bold">90%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '90%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

