import { Link, Outlet, useLocation } from "react-router-dom";
import { Layout } from "../Dashboard/Layout";
import { useSelector } from "react-redux";
import { usePortalData } from "../../hooks/react-query/usePortalData";
import { useMediaQuery } from 'react-responsive';

const SettingsLayout = () => {
    const location = useLocation();
    const isLessThan1024 = useMediaQuery({ query: '(max-width: 1024px)' });
    const { user, currentSelectedPortal } = useSelector((state) => state.auth);
    const { data: portal } = usePortalData(currentSelectedPortal);
    const secondaryNavigation = [
        { name: 'Settings', href: '/settings/portal' },
        { name: 'Account', href: '/settings/account' },
        ...(portal?.created_by === user?.id ? [{ name: 'Subscriptions', href: '/settings/subscriptions' }] : []),
        { name: 'Teams', href: '/settings/teams' },
    ].filter(Boolean);

    return (
        <Layout>
            <div className="bg-white  ">
                <header className="sticky top-0 z-10 bg-white border-b border-gray-200">

                    {
                        !isLessThan1024 && (
                            <nav className="flex overflow-x-auto py-4">
                                <ul className="flex min-w-full flex-none gap-x-6 px-4 text-sm font-medium sm:px-6 lg:px-8">
                                    {secondaryNavigation.map((item) => (
                                        <li key={item.name}>
                                            <Link
                                                to={item.href}
                                                className={`${location.pathname === item.href
                                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                                    : 'text-gray-500 hover:text-gray-700'
                                                    } pb-4 px-1`}
                                            >
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        )
                    }

                </header>
                <div style={{ height: 'calc(100vh - 60px)' }}>
                    <Outlet />
                </div>
            </div>
        </Layout>

    );
};

export default SettingsLayout;