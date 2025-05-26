import React from "react";

import {
    Label,
    Listbox,
    ListboxButton,
    ListboxOptions,
} from "@headlessui/react";
import MoodIcon from "./MoodIcon";
import MoodOption from "./MoodOption";
import { moods } from "../../../utils/moodUtils";

const MoodSelector = ({ selected, onChange }) => (
    <div className="flex items-center">
        <Listbox value={selected} onChange={onChange}>
            <Label className="sr-only">Your mood</Label>
            <div className="relative">
                <ListboxButton className="relative -m-2.5 flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500">
                    <MoodIcon mood={selected} />
                </ListboxButton>
                <ListboxOptions className="absolute bottom-10 z-10 -ml-6 w-60 rounded-lg bg-white py-3 text-base shadow ring-1 ring-black ring-opacity-5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:ml-auto sm:w-64 sm:text-sm">
                    {moods.map((mood) => (
                        <MoodOption key={mood.value} mood={mood} />
                    ))}
                </ListboxOptions>
            </div>
        </Listbox>
    </div>
);
export default MoodSelector;