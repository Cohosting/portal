function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}
export default function SidebarItem({ item }) {
    return (
        <li>
            <a
                href={item.href}
                className={classNames(
                    item.current ? 'bg-indigo-700 text-white' : 'text-indigo-200 hover:bg-indigo-700 hover:text-white',
                    'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
                )}
            >
                {item.icon && (
                    <item.icon
                        aria-hidden="true"
                        className={classNames(
                            item.current ? 'text-white' : 'text-indigo-200 group-hover:text-white',
                            'h-6 w-6 shrink-0',
                        )}
                    />
                )}
                {item.initial && (
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-indigo-400 bg-indigo-500 text-[0.625rem] font-medium text-white">
                        {item.initial}
                    </span>
                )}
                <span className="truncate">{item.name}</span>
            </a>
        </li>
    );
}
