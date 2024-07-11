import { BanknotesIcon, ChatBubbleBottomCenterTextIcon, DocumentDuplicateIcon, HomeIcon } from "@heroicons/react/20/solid";
import { classNames } from "../../../../utils/statusStyles";
import { useLocation, useNavigate } from "react-router-dom";
import { lighten, transparentize, readableColor } from "polished";



const renderIcons = (name, styles) => {
    switch (name) {
        case 'Dashboard':
            return <HomeIcon className={styles} />;
        case 'Messages':
            return <ChatBubbleBottomCenterTextIcon className={styles} />;
        case 'Files':
            return <DocumentDuplicateIcon className={styles} />;
        case 'Billing':
            return <BanknotesIcon className={styles} />;

        default: return <HomeIcon className={styles} />;
    }
};


const isActive = (name, current) => {
    return name === current
}

const Navigation = ({
    portal_apps,
    portal
}) => {

    const navigate = useNavigate();
    const location = useLocation();
    const {
        sidebarBgColor,
        sidebarTextColor = 'rgb(79, 70, 229)',
        accentColor = 'rgb(79, 70, 229)',
        sidebarActiveTextColor,
        fullLogo
    } = portal?.brand_settings || {};
    // Calculate derived colors
    const sidebarItemHoverBgColor = transparentize(0.8, accentColor); // 20% opacity
    const sidebarItemHoverColor = lighten(0.2, sidebarTextColor); // lighten the text color by 20%


    return (
        <div style={{
            backgroundColor: sidebarBgColor,
        }} className={`flex grow flex-col gap-y-5 overflow-y-auto ${sidebarBgColor ? `bg-[${sidebarBgColor}]` : 'bg-white'
            } px-6 pb-2 border-r border-gray-20  `}>
            <div className="flex h-16 shrink-0 items-center">
                <img
                    alt="Your Company"
                    src={fullLogo || "https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"}
                    className="h-8 w-auto"
                />
            </div>
            <nav className="flex flex-1 flex-col">
                <ul className="flex flex-1 flex-col gap-y-7">
                    {portal_apps.map((item) => {
                        const decodedPath = decodeURIComponent(location.pathname.split('/')[2]);
                        const active = isActive(item.name.toLowerCase(), decodedPath.toLowerCase());

                        return (
                            <li key={item.id}>
                                <button
                                    onClick={() => navigate(`/portal/${item.name.toLowerCase()}`)}
                                    className={classNames(
                                        'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 w-full',
                                        { 'hover:bg-opacity-20': !active }
                                    )}
                                    style={{
                                        color: active ? sidebarActiveTextColor : sidebarTextColor, // Use user-defined active text color
                                        backgroundColor: active ? `${accentColor}33` : 'transparent', // Use accent color with transparency for active background
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = sidebarItemHoverBgColor; // Apply hover background color
                                        e.currentTarget.style.color = sidebarItemHoverColor; // Apply hover text color
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = active ? `${accentColor}33` : 'transparent'; // Revert to active or default background color
                                        e.currentTarget.style.color = active ? sidebarActiveTextColor : sidebarTextColor; // Revert to active or default text color
                                    }}
                                >
                                    {renderIcons(item.name, classNames(
                                        'h-6 w-6 shrink-0',
                                        { 'text-opacity-80 group-hover:text-opacity-80': !active },
                                        { 'text-opacity-100': active }
                                    ))}
                                    {item.name}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </div>
    );
};

export default Navigation