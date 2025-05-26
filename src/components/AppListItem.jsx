import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bars3BottomLeftIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { renderAppText } from '../pages/App/AppView';

const AppListItem = ({ item, index, markAsDisabled, handleDeleteApp }) => {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-between gap-x-6 py-5 px-6 bg-white rounded-md">
            <div className="flex items-center">
                <Bars3BottomLeftIcon className="w-6 h-6 mr-2 drag-handle cursor-move" />
                <div className='ml-3'>
                    <div className="flex items-start gap-x-3">
                        <p className="text-sm font-semibold leading-6 text-gray-900">{item.name}</p>
                    </div>
                    <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                        {renderAppText(item?.settings)}
                    </div>
                </div>
            </div>
            {
                !item.is_default && (
                    <Menu as="div" className="relative flex-none">
                        <MenuButton className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                            <span className="sr-only">Open options</span>
                            <EllipsisVerticalIcon aria-hidden="true" className="h-5 w-5" />
                        </MenuButton>
                        <MenuItems
                            transition
                            className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                        >
                            <MenuItem>
                                <button onClick={() => navigate(`${item.id}/edit`)} className="w-full text-left block px-3 py-1 text-sm leading-6 text-gray-900 data-[focus]:bg-gray-50">
                                    Edit<span className="sr-only">, {item.name}</span>
                                </button>
                            </MenuItem>

                            {
                                !item.is_default && (
                                    <MenuItem>
                                        <button 
                                            onClick={() => handleDeleteApp(item.id)}
                                            className="w-full text-left block px-3 py-1 text-sm leading-6 text-gray-900 data-[focus]:bg-gray-50"
                                        >
                                            Delete<span className="sr-only">, {item.name}</span>
                                        </button>
                                    </MenuItem>
                                )
                            }
                        </MenuItems>
                    </Menu>
                )
            }
        </div>
    );
};

export default AppListItem;