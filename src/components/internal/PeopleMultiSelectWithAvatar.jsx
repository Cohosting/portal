import { useState, useEffect } from "react";
import {
    Label,
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions,
} from "@headlessui/react";
import { ChevronDown } from "lucide-react";
import { Check } from "lucide-react";
import { Button } from "../ui/button";

const PeopleMultiSelectWithAvatar = ({ people, onChange, label = "Assigned to" }) => {
    const [selected, setSelected] = useState([]);

    useEffect(() => {
        onChange(selected);
    }, [selected, onChange]);

    const handleSelectAll = () => {
        if (selected.length === people.length) {
            setSelected([]);
        } else {
            setSelected([...people]);
        }
    };

    return (
        <Listbox value={selected} onChange={setSelected} multiple>
            <Label className="block text-sm font-medium leading-6 text-black">
                {label}
            </Label>
            <div className="mt-2">
                <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-black shadow-sm ring-1 ring-inset ring-black focus:outline-none focus:ring-2 focus:ring-black sm:text-sm sm:leading-6">
                    <span className="flex items-center">
                        {selected.length === 0 ? (
                            <span className="block truncate text-gray-500">
                                Select people...
                            </span>
                        ) : (
                            <>
                                <span className="block truncate">
                                    {selected.map((person) => person.name).join(", ")}
                                </span>
                                <span className="ml-2 text-gray-500">({selected.length})</span>
                            </>
                        )}
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                        <ChevronDown
                            aria-hidden="true"
                            className="h-5 w-5 text-gray-700"
                        />
                    </span>
                </ListboxButton>

                <ListboxOptions
                    transition
                    className="absolute z-10 mt-1 max-h-56 w-[calc(100%-48px)] overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:text-sm"
                >
                    {people.length === 0 && (
                        <div className="px-4 py-2 text-gray-500">
                            No people available
                        </div>
                    )}
                    {people.map((person) => (
                        <ListboxOption
                            key={person.id}
                            value={person}
                            className="group relative cursor-default select-none py-2 pl-3 pr-9 text-black data-[focus]:bg-black data-[focus]:text-white"
                        >
                            {({ selected, active }) => (
                                <>
                                    <div className="flex items-center">
                                        <img
                                            alt=""
                                            src={person.avatar}
                                            className="h-5 w-5 flex-shrink-0 rounded-full"
                                        />
                                        <span
                                            className={`ml-3 block truncate ${selected ? "font-semibold" : "font-normal"
                                                }`}
                                        >
                                            {person.name}
                                        </span>
                                    </div>

                                    {selected && (
                                        <span
                                            className={`absolute inset-y-0 right-0 flex items-center pr-4 ${active ? "text-white" : "text-black"
                                                }`}
                                        >
                                            <Check aria-hidden="true" className="h-5 w-5" />
                                        </span>
                                    )}
                                </>
                            )}
                        </ListboxOption>
                    ))}
                </ListboxOptions>
                <div className="mt-4 flex justify-end">
                    <Button className="bg-black text-white" size="sm" variant="soft" onClick={handleSelectAll}>
                        {selected.length === people.length ? "Deselect All" : "Select All"}
                    </Button>
                </div>
            </div>
        </Listbox>
    );
};

export default PeopleMultiSelectWithAvatar;
