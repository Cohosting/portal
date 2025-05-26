import { FaceSmileIcon } from "@heroicons/react/24/solid";
import { classNames } from "../../../utils/statusStyles";

const MoodIcon = ({ mood }) => (
    <span className="flex items-center justify-center">
        {mood.value === null ? (
            <span>
                <FaceSmileIcon aria-hidden="true" className="h-5 w-5 flex-shrink-0" />
                <span className="sr-only">Add your mood</span>
            </span>
        ) : (
            <span>
                <span className={classNames(mood.bgColor, "flex h-8 w-8 items-center justify-center rounded-full")}>
                    <mood.icon aria-hidden="true" className="h-5 w-5 flex-shrink-0 text-white" />
                </span>
                <span className="sr-only">{mood.name}</span>
            </span>
        )}
    </span>
);

export default MoodIcon;