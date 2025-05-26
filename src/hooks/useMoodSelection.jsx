import { useState } from "react";
import { moods } from "../utils/moodUtils.js";

export const useMoodSelection = (onMoodChange) => {
    const [selected, setSelected] = useState(moods[5]);

    const handleMoodChange = (newMood) => {
        setSelected(newMood);
        onMoodChange(newMood);
    };

    return { selected, handleMoodChange };
};
