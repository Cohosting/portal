import React from 'react';
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react';
import { ChevronUpDown, Check } from 'lucide-react';

const Select = ({ list, selected, setSelected, label, renderItem, placeholder }) => {
    return (
        <div>
            <Listbox value={selected} onChange={setSelected}>
                <label className="block text-sm font-medium leading-6 text-gray-900">{label}</label>
                <div className="relative mt-2">
                    <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm sm:leading-6">
                        <span className="block truncate">
                            {selected ? (selected.name || selected) : placeholder}
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronUpDown aria-hidden="true" className="h-5 w-5 text-gray-400" />
                        </span>
                    </ListboxButton>

                    <ListboxOptions
                        transition
                        className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:text-sm"
                    >
                        {list.map((item) => (
                            <ListboxOption
                                key={item.id || item}
                                value={item}
                                className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white"
                            >
                                {renderItem ? renderItem(item) : (
                                    <span className="block truncate font-normal group-data-[selected]:font-semibold">
                                        {item.name || item}
                                    </span>
                                )}
                                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-data-[focus]:text-white [.group:not([data-selected])_&]:hidden">
                                    <Check aria-hidden="true" className="h-5 w-5" />
                                </span>
                            </ListboxOption>
                        ))}
                    </ListboxOptions>
                </div>
            </Listbox>
        </div>
    );
};

export default Select;
