import { ListboxOption } from "@headlessui/react";
import { classNames } from "../../../utils/statusStyles";

const MoodOption = ({ mood }) => (
    <ListboxOption
        value={mood}
        className="relative cursor-default select-none bg-white px-3 py-2 data-[focus]:bg-gray-100"
    >
        <div className="flex items-center">
            <div className={classNames(mood.bgColor, "flex h-8 w-8 items-center justify-center rounded-full")}>
                <mood.icon
                    aria-hidden="true"
                    className={classNames(mood.iconColor, "h-5 w-5 flex-shrink-0")}
                />
            </div>
            <span className="ml-3 block truncate font-medium">{mood.name}</span>
        </div>
    </ListboxOption>
);

export default MoodOption;