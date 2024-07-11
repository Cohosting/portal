/* import React from 'react'

const InvoicePaymentSettings = () => {
    return (
        <div>InvoicePaymentSettings</div>
    )
}

export default InvoicePaymentSettings */

import { Switch } from "@headlessui/react";
import SectionHeader from "./SectionHeader";
import SwitchComponent from "./SwitchComponent";

/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
export default function InvoicePaymentSettings({
    settings,
    handleSettingUpdate
}) {
    return (
        <>
            <fieldset className="border-b border-t border-gray-200 mt-5">
                <legend className="sr-only">Notifications</legend>

                <div className="divide-y divide-gray-200">
                    <div className="relative flex items-start pb-4 pt-3.5">
                        <div className="min-w-0 flex-1 text-sm leading-6">
                            <label htmlFor="comments" className="font-medium text-gray-900">
                                Enable ACH Debit Payment

                            </label>
                            <p id="comments-description" className="text-gray-500">
                                Allow invoices to be paid directly from your bank account using ACH debit. This method ensures secure and straightforward transactions.


                            </p>
                        </div>
                        <div className="ml-3 flex h-6 items-center">
                            {/*  <input
                                id="comments"
                                name="comments"
                                type="checkbox"
                                aria-describedby="comments-description"
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                checked={settings.ach_debit}
                                onChange={(e) => handleSettingUpdate('ach_debit', e.target.checked)}
                            /> */}
                            <SwitchComponent enabled={settings.ach_debit} setEnabled={(e) => handleSettingUpdate('ach_debit', e)} />
                        </div>
                    </div>
                    <div className="relative flex items-start pb-4 pt-3.5">
                        <div className="min-w-0 flex-1 text-sm leading-6">
                            <label htmlFor="candidates" className="font-medium text-gray-900">
                                Use Card for Payment

                            </label>
                            <p id="candidates-description" className="text-gray-500">
                                Enable payment of invoices using a credit. This option provides a fast and convenient way to handle payments.


                            </p>
                        </div>
                        <div className="ml-3 flex h-6 items-center">
                            {/*                             <input
                                id="candidates"
                                name="candidates"
                                type="checkbox"
                                aria-describedby="candidates-description"
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                checked={settings.card}
                                onChange={(e) => handleSettingUpdate('card', e.target.checked)}

                            /> */}
                            <SwitchComponent enabled={settings.card} setEnabled={(e) => handleSettingUpdate('card', e)} />

                        </div>
                    </div>

                </div>
            </fieldset>
        </>

    )
}
