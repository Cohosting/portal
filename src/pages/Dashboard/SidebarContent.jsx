import { ChevronRightIcon } from '@chakra-ui/icons';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import {
    CalendarIcon,
    ComputerDesktopIcon,
    DocumentDuplicateIcon,
    BanknotesIcon,
    HomeIcon,
    UsersIcon,
    PaintBrushIcon,
    CreditCardIcon,
    AdjustmentsHorizontalIcon,
    UserCircleIcon,
    CpuChipIcon,
    ArrowRightEndOnRectangleIcon


} from '@heroicons/react/24/outline';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePortalData } from '../../hooks/react-query/usePortalData';
import Avatar from '../../components/UI/Avatar';
function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}



const preference = [
    { name: 'App', href: '/apps', icon: ComputerDesktopIcon, current: true },
    { name: 'Customize', href: '/customize', icon: PaintBrushIcon, current: false },
    { name: 'Team', href: '/team', icon: UsersIcon, current: false },
    { name: 'Subscription', href: '/subscription', icon: CreditCardIcon, current: false },
    { name: 'Portal Settings', href: '/settings', icon: AdjustmentsHorizontalIcon, current: false },
    { name: 'Profile', href: '/settings/me', icon: UserCircleIcon, current: false },
];

export default function SidebarContent() {
    const navigate = useNavigate();
    const locaiton = useLocation()

    let isCurrent = (href) => {
        // just for /
        if (href === '/') {
            return locaiton.pathname === '/'
        }
        return locaiton.pathname.includes(href)
    }

    const { user } = useSelector(state => state.auth);
    const { data: portal } = usePortalData(user?.portals);


    let portal_apps = portal?.portal_apps?.filter(app => !app.is_default) || []
    const navigation = [
        { name: 'Dashboard', href: '/', icon: HomeIcon, current: false },
        { name: 'Clients', href: '/clients', icon: UsersIcon, current: false },
        { name: 'Files', href: '/files', icon: DocumentDuplicateIcon, current: false },
        { name: 'Messages', href: '/messages', icon: CalendarIcon, current: false },
        { name: 'Billing', href: '/billing', icon: BanknotesIcon, current: false },
        {
            name: 'App Configurations', href: `${portal_apps.length ?
                `/apps/${portal_apps[0].id}/app-configurations/` : '/apps/no-apps/app-configurations'}`, icon: CpuChipIcon, current: false, children: portal_apps
        },
    ];
    return (
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-20 bg-white px-4 pb-4">

            <div className='flex pt-5'>
                <Avatar fullName={user?.name || ''} imageUrl={user?.avatar} size="large" />
                <div className="ml-3">
                    <div className="text-sm font-semibold text-gray-700">{user?.name}</div>
                    <div className="text-xs font-semibold text-gray-400">{portal?.portal_url || 'Unknown'}</div>
                </div>
            </div>
            <nav className="flex flex-1 flex-col">
                <ul className="flex flex-1 flex-col gap-y-7">
                    <li>
                        <ul className="-mx-2 space-y-1">
                            {navigation.map((item) => (

                                <li key={item.name}>
                                    {
                                        !item.children?.length ? (
                                            <button
                                                href={item.href}
                                                onClick={() => navigate(item.href)}
                                                className={classNames(
                                                    isCurrent(item.href)
                                                        ? 'bg-gray-50 text-indigo-600'
                                                        : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600',
                                                    'group flex gap-x-3 rounded-md p-2 text-xs font-semibold w-full leading-6',
                                                )}
                                            >
                                                <item.icon
                                                    aria-hidden="true"
                                                    className={classNames(
                                                        isCurrent(item.href) ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600',
                                                        'h-6 w-6 shrink-0',
                                                    )}
                                                />
                                                {item.name}
                                            </button>
                                        ) : (
                                            <Disclosure as="div">
                                                <DisclosureButton
                                                    className={classNames(
                                                        isCurrent(item.href) ? 'bg-gray-50' : 'hover:bg-gray-50',
                                                        'group flex w-full items-center gap-x-3 rounded-md p-2 text-left text-xs font-semibold leading-6 text-gray-700',
                                                    )}
                                                >
                                                    <item.icon aria-hidden="true" className="h-6 w-6 shrink-0 text-gray-400" />
                                                    {item.name}
                                                    <ChevronRightIcon
                                                        aria-hidden="true"
                                                        className="ml-auto h-5 w-5 shrink-0 text-gray-400 group-data-[open]:rotate-90 group-data-[open]:text-gray-500"
                                                    />
                                                </DisclosureButton>
                                                <DisclosurePanel as="ul" className="mt-1 px-2">
                                                    {item.children.map((subItem) => (
                                                        <li key={subItem.name}>
                                                            {/* 44px */}
                                                            <button

                                                                onClick={() => {
                                                                    navigate(`/apps/${subItem.id}/app-configurations`)
                                                                }}
                                                                className={classNames(
                                                                    subItem.current ? 'bg-gray-50' : 'hover:bg-gray-50',
                                                                    'block rounded-md py-2 pl-9 pr-2 text-sm leading-6 text-gray-700',
                                                                )}
                                                            >
                                                                {subItem.name}
                                                            </button>
                                                        </li>
                                                    ))}
                                                </DisclosurePanel>
                                            </Disclosure>
                                        )
                                    }

                                </li>
                            ))}
                        </ul>
                    </li>
                    <div className="w-full border-t border-gray-300" />

                    <li>
                        <div className="text-xs font-semibold leading-6 text-gray-400">Preference</div>
                        <ul className="-mx-2 mt-2 space-y-1">
                            {preference.map((item) => (

                                <button
                                    href={item.href}
                                    onClick={() => navigate(item.href)}
                                    className={classNames(
                                        isCurrent(item.href)
                                            ? 'bg-gray-50 text-indigo-600'
                                            : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600',
                                        'group flex gap-x-3 rounded-md p-2 text-xs font-semibold w-full leading-6',
                                    )}
                                >
                                    <item.icon
                                        aria-hidden="true"
                                        className={classNames(
                                            isCurrent(item.href) ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600',
                                            'h-6 w-6 shrink-0',
                                        )}
                                    />
                                    {item.name}
                                </button>
                            ))}
                        </ul>
                    </li>
                    <li className="mt-auto">
                        <a
                            href={`http://${portal?.portal_url}.localhost:3000/login`}
                            className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                        >
                            <ArrowRightEndOnRectangleIcon
                                aria-hidden="true"
                                className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600"
                            />
                            Portal view
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    );
}
