import React from "react";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";

const DropdownMenu = ({ trigger, options }) => {
    return (
        <Menu as="div" className="relative w-fit">
            <MenuButton className="-m-1.5 flex items-center p-1.5">
                {trigger}
            </MenuButton>
            <MenuItems
                transition
                className="absolute right-0 z-20 mt-2.5 w-48 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
            >
                {options.map((item) => (
                    <MenuItem key={item.name} as="div">
                        <div
                            onClick={item.onClick}
                            className={`block px-3 py-1 text-sm leading-6 text-gray-900 hover:bg-gray-50 cursor-pointer select-none`}
                        >
                            {item.name}
                        </div>
                    </MenuItem>
                ))}
            </MenuItems>
        </Menu>
    );
};

export default DropdownMenu;
