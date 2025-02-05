import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import {
    CalendarIcon,
    ComputerDesktopIcon,
    DocumentDuplicateIcon,
    BanknotesIcon,
    HomeIcon,
    UsersIcon,
    PaintBrushIcon,
    AdjustmentsHorizontalIcon,
    CpuChipIcon,
    ArrowRightEndOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { usePortalData } from '../../hooks/react-query/usePortalData';
import Avatar from '../../components/UI/Avatar';
import PortalSwitcher from '../../components/UI/PortalSwitcher';
import { useConversationContext } from '../../context/useConversationContext';
import { ArrowRight, Bank, User, Users } from '@phosphor-icons/react';
import { useMediaQuery } from 'react-responsive';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

const preference = [
    { name: 'App', href: '/apps', icon: ComputerDesktopIcon, current: true },
    { name: 'Customize', href: '/customize', icon: PaintBrushIcon, current: false },
    { name: 'Portal Settings', href: '/settings/portal', icon: AdjustmentsHorizontalIcon, current: false },
];

export default function SidebarContent() {
    const { setSidebarOpen } = useConversationContext()
    const navigate = useNavigate();
    const locaiton = useLocation()
    const { appId } = useParams()
    const isLessThan1024 = useMediaQuery({ query: '(max-width: 1024px)' });

    let isCurrent = (href) => {
        // just for /
        if (href === '/') {
            return locaiton.pathname === '/'
        }
        return locaiton.pathname.includes(href)
    }

    const { user, currentSelectedPortal } = useSelector(state => state.auth);
    const { data: portal } = usePortalData(currentSelectedPortal);

    let portal_apps = portal?.portal_apps?.filter(app => !app.is_default) || []
    const navigation = [
        { name: 'Dashboard', href: '/', icon: HomeIcon, current: false },
        { name: 'Clients', href: '/clients', icon: UsersIcon, current: false },
        { name: 'Files', href: '/files', icon: DocumentDuplicateIcon, current: false },
        { name: 'Messages', href: '/messages', icon: CalendarIcon, current: false },
        { name: 'Billing', href: '/billing', icon: BanknotesIcon, current: false },
        {
            name: 'App Configurations', href: `${portal_apps.length ?
                `/apps/${portal_apps[0]?.id}/app-configurations/` : '/apps/no-apps/app-configurations'}`, icon: CpuChipIcon, current: false, children: portal_apps
        },
    ];

    const mobileNavigation = [
        { name: 'Account', href: '/settings/account', icon: User, current: false },
        ...(portal?.created_by === user?.id ? [{ name: 'Subscriptions', href: '/settings/subscriptions', icon: Bank, current: false }] : []),
        { name: 'Team', href: '/settings/teams', icon: Users, current: false },
    ].filter(Boolean);

    return (
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-20 bg-white px-4 pb-4">
            <PortalSwitcher />

            <div className='flex '>
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
                                                onClick={() => {
                                                    navigate(item.href)
                                                    setSidebarOpen(false)
                                                }}
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
                                                        <ArrowRight
                                                        aria-hidden="true"
                                                        className="ml-auto h-5 w-5 shrink-0 text-gray-400 group-data-[open]:rotate-90 group-data-[open]:text-gray-500"
                                                    />
                                                </DisclosureButton>
                                                <DisclosurePanel as="ul" className="mt-1 px-2">
                                                    {item.children.map((subItem) => (
                                                        <li key={subItem.name}>
                                                            <button

                                                                onClick={() => {
                                                                    navigate(`/apps/${subItem?.id}/app-configurations`)
                                                                    setSidebarOpen(false)
                                                                }}
                                                                className={`w-full text-left ${classNames(
                                                                    subItem.id === appId ?

                                                                        'border-l-2 border-indigo-600 rounded-l-none bg-gray-50 text-indigo-600 '
                                                                        : 'hover:bg-gray-50',
                                                                    'block rounded-md py-2 pl-9 pr-2 text-sm leading-6 text-gray-700',
                                                                )}`} 
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
                                    onClick={() => {
                                        navigate(item.href)
                                        setSidebarOpen(false)
                                    }}
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
                            {
                                isLessThan1024 && mobileNavigation.map((item) => (
                                    <button
                                        key={item.name}
                                        onClick={() => {
                                            navigate(item.href)
                                            setSidebarOpen(false)
                                        }}
                                        className={classNames(
                                            isCurrent(item.href) ? 'bg-gray-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600',
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
                                ))
                            }
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
