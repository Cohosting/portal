import { Tab, TabGroup, TabList } from '@headlessui/react'
import React from 'react'

const BillingActivityTabs = ({
    onTabChange,
    tabs
}) => {


    return (
        <TabGroup className={'mt-5'}>
            <TabList className="flex space-x-1 border-b border-gray-200">
                {tabs?.map((tab) => (
                    <Tab
                        onClick={() => onTabChange(tab)}
                        key={tab.name}
                        className={({ selected }) =>
                            `py-2 px-4 text-sm font-medium leading-5 focus:outline-none
                            ${selected
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                            }`
                        }
                    >
                        <span>{tab.name}</span>
                        <span className="ml-2 text-gray-400">{tab.count}</span>
                    </Tab>
                ))}
            </TabList>

        </TabGroup>
    )
}

export default BillingActivityTabs