import { Dialog, DialogBackdrop, DialogPanel, TransitionChild } from "@headlessui/react";
import Navigation from "./Navigation";

import { XMarkIcon } from "@heroicons/react/20/solid";

const Sidebar = ({ portal_apps, portal, sidebarOpen, setSidebarOpen }) => {
    return (
        <Dialog open={sidebarOpen} onClose={() => setSidebarOpen(false)} className="relative z-50 lg:hidden">
            <DialogBackdrop
                className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
            />
            <div className="fixed inset-0 flex">
                <DialogPanel className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full">
                    <TransitionChild>
                        <div className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
                            <button type="button" onClick={() => setSidebarOpen(false)} className="-m-2.5 p-2.5">
                                <span className="sr-only">Close sidebar</span>
                                <XMarkIcon aria-hidden="true" className="h-6 w-6 text-white" />
                            </button>
                        </div>
                    </TransitionChild>
                    <Navigation portal={portal} portal_apps={portal_apps} />
                </DialogPanel>
            </div>
        </Dialog>
    );
}


export default Sidebar;