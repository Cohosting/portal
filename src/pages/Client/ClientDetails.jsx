import React, { useState } from 'react';
import { Layout } from '../Dashboard/Layout';
import { Menu, Transition } from '@headlessui/react';
import { Plus } from 'lucide-react';

export const ClientDetails = () => {
  const [customProperties, setCustomProperties] = useState([]);

  const handleCreateCustomProperties = el => {
    setCustomProperties([...customProperties, { ...el, id: Math.random() }]);
  };

  return (
    <Layout>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-3 border-b border-gray-200">
          <span className="text-lg font-medium">Client Details</span>
          <button className="bg-blue-500 text-white px-4 py-2 rounded">New</button>
        </div>
        <div className="flex flex-1">
          <div className="flex-1 h-full">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-4">
                <button className="px-3 py-2 text-sm font-medium text-gray-700">Messages</button>
                <button className="px-3 py-2 text-sm font-medium text-gray-700">Invoices</button>
                <button className="px-3 py-2 text-sm font-medium text-gray-700">Files</button>
                <button className="px-3 py-2 text-sm font-medium text-gray-700">Forms</button>
              </nav>
            </div>
            <div className="p-4">
              <p>This is message!</p>
            </div>
          </div>
          <div className="w-96 h-full p-2 shadow-lg">
            <span className="block text-lg font-medium">User details</span>
            <div className="flex items-center mt-3">
              <img
                className="w-12 h-12 rounded-lg"
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"
                alt="Client"
              />
              <div className="ml-2">
                <span className="block">John Doe</span>
                <span className="block">exxamplee@gmail.com</span>
              </div>
            </div>
            <div className="flex flex-col mt-3">
              <span>Joined</span>
              <span>23rd March 2023</span>
            </div>
            <div className="mt-4">
              <Menu as="div" className="relative">
                <div>
                  <Menu.Button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">
                    Open
                    <Plus className="ml-2" />
                  </Menu.Button>
                </div>
                <Transition
                  as={React.Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {property.map((el) => (
                      <Menu.Item key={el.id}>
                        {({ active }) => (
                          <button
                            onClick={() => handleCreateCustomProperties(el)}
                            className={`${active ? 'bg-gray-100' : ''
                              } group flex items-center w-full px-2 py-2 text-sm text-gray-900`}
                          >
                            {el.icon}
                            {el.title}
                          </button>
                        )}
                      </Menu.Item>
                    ))}
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
