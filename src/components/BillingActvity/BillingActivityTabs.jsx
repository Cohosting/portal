import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import React from 'react'

const BillingActivityTabs = ({
    onTabChange,
    tabs, 
    colorSettings = {}
}) => {
    const handleValueChange = (value) => {
        const selectedTab = tabs.find(tab => tab.name === value)
        if (selectedTab) {
            onTabChange(selectedTab)
        }
    }

    const primaryColor = colorSettings?.sidebarBgColor || '#3b82f6'

    return (
        <div className="mt-5">
            <Tabs defaultValue='All' onValueChange={handleValueChange} className="w-full">
                <style jsx>{`
                    [data-state="active"] {
                        border-bottom-color: ${primaryColor} !important;
                        color: ${primaryColor} !important;
                    }
                    [data-state="active"]:focus-visible {
                        border-bottom-color: ${primaryColor} !important;
                    }
                `}</style>
                <TabsList className="h-auto w-full p-0 bg-transparent border-b border-gray-200 rounded-none justify-start px-3 sm:px-6">
                    {tabs?.map((tab) => (
                        <TabsTrigger
                            key={tab.name}
                            value={tab.name}
                            className={`py-2 px-4 text-sm font-medium leading-5 rounded-none border-0 border-b-2 border-b-transparent data-[state=active]:bg-transparent bg-transparent text-gray-500 hover:text-gray-700 data-[state=active]:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:border-b-2 focus-visible:border-b-transparent`}
                            style={{
                                '--active-color': primaryColor
                            }}
                            data-active-color={primaryColor}
                        >
                            <span>{tab.name}</span>
                            <span className="ml-2 text-gray-400">{tab.count}</span>
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>
        </div>
    )
}

export default BillingActivityTabs