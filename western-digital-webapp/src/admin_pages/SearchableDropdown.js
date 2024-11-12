import { useEffect, useRef, useState } from "react";

const SearchableDropdown = ({ options, label, id, selectedVal, handleChange }) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    document.addEventListener("click", toggleDropdown);
    return () => document.removeEventListener("click", toggleDropdown);
  }, []);

  const toggleDropdown = (e) => {
    setIsOpen(e && e.target === inputRef.current);
  };

  const selectOption = (option) => {
    setQuery("");
    handleChange(option[id]); // Pass mentee's id as selected value
    setIsOpen(false);
  };

  const filterOptions = () => {
    return options.filter((option) =>
      option[label].toLowerCase().includes(query.toLowerCase())
    );
  };

  return (
    <div className="dropdown">
      <div className="control">
        <input
          ref={inputRef}
          type="text"
          value={query || selectedVal || ""}
          placeholder="Search for a mentee..."
          onChange={(e) => {
            setQuery(e.target.value);
            handleChange(null);
          }}
          onClick={toggleDropdown}
        />
      </div>
      {isOpen && (
        <div className="options">
          {filterOptions().map((option) => (
            <div
              key={option[id]}
              onClick={() => selectOption(option)}
              className="option"
            >
              {option[label]}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchableDropdown;
