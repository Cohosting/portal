

import SwitchComponent from "./SwitchComponent";

export default function InvoicePaymentSettings({
    settings,
    handleSettingUpdate
}) {
    console.log(settings)
    return (
        <>
            <fieldset className="border-b border-t border-gray-200 mt-3">
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
                            <SwitchComponent enabled={settings?.ach_debit} setEnabled={(e) => handleSettingUpdate('ach_debit', e)} />
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

                            <SwitchComponent enabled={settings?.card} setEnabled={(e) => handleSettingUpdate('card', e)} />

                        </div>
                    </div>

                </div>
            </fieldset>
        </>

    )
}
