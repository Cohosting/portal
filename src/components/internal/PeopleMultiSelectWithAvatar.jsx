import { useState, useEffect, useRef } from "react";
import { Checkbox } from "../ui/checkbox";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";

const PeopleMultiSelectWithAvatar = ({
  people,
  onChange,
  label = "Assigned to",
}) => {
  const [selected, setSelected] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    onChange(selected);
  }, [selected, onChange]);

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isAllSelected = selected.length === people.length;
  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelected([]);
    } else {
      setSelected([...people]);
    }
  };

  const togglePerson = (person) => {
    if (selected.find((p) => p.id === person.id)) {
      setSelected(selected.filter((p) => p.id !== person.id));
    } else {
      setSelected([...selected, person]);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <label className="block text-sm font-medium text-black">{label}</label>

      <Button
        variant="outline"
        className="mt-2 w-full justify-between border border-gray-400 bg-white text-black hover:bg-gray-50"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {selected.length === 0 ? (
          <span className="text-gray-500">Select people...</span>
        ) : (
          <span>
            {selected.map((p) => p.name).join(", ")}{" "}
            <span className="text-gray-500">({selected.length})</span>
          </span>
        )}
        <svg
          className={`h-5 w-5 text-gray-700 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </Button>

      {/* Deselect/Select All button positioned below input, right-aligned */}
      <div className="mt-2 flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          className="border border-gray-400 text-black bg-white hover:bg-gray-50"
          onClick={handleSelectAll}
        >
          {isAllSelected ? "Deselect All" : "Select All"}
        </Button>
      </div>

      {isOpen && (
        <div className="absolute top-16 z-50 mt-1 w-full max-h-60 overflow-auto rounded-md border border-gray-400 bg-white p-2 shadow-lg">
          {people.length === 0 ? (
            <p className="px-4 text-sm  text-gray-500">No people available</p>
          ) : (
            <div className="space-y-1">
              {people.map((person) => {
                const checked = !!selected.find((p) => p.id === person.id);
                return (
                  <div
                    key={person.id}
                    className="flex items-center justify-between rounded-md px-2 py-1 hover:bg-gray-100 cursor-pointer"
                    onClick={() => togglePerson(person)}
                  >
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={person.avatar} alt={person.name} />
                        <AvatarFallback>{person.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className={checked ? "font-semibold" : "font-normal"}>
                        {person.name}
                      </span>
                    </div>
                    <Checkbox
                      checked={checked}
                      onCheckedChange={() => togglePerson(person)}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PeopleMultiSelectWithAvatar;
