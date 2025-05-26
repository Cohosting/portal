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
        <Layout hideMobileNav>
            <div className="bg-white  ">

                <div style={{ height: 'calc(100vh)' }}>
                    <Outlet />
                </div>
            </div>
        </Layout>

    );
};

export default SettingsLayout;