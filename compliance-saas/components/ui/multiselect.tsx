import React, { useState } from 'react';

interface MultiSelectProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({ options, selected, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleOption = (option: string) => {
    if (option === 'All') {
      if (selected.includes('All')) {
        onChange([]);
      } else {
        onChange(options);
      }
    } else {
      const newSelected = selected.includes(option)
        ? selected.filter(item => item !== option)
        : [...selected, option];
      onChange(newSelected.includes('All') ? newSelected.filter(item => item !== 'All') : newSelected);
    }
  };

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayText = selected.length === options.length ? 'All' : selected.join(', ');

  return (
    <div className="relative">
      <div
        className="border p-2 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {displayText || placeholder}
      </div>
      {isOpen && (
        <div className="absolute border bg-white w-full mt-1 z-10">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            className="p-2 w-full border-b"
          />
          <ul>
            {filteredOptions.map(option => (
              <li key={option} className="p-2 hover:bg-gray-200 cursor-pointer" onClick={() => toggleOption(option)}>
                <input
                  type="checkbox"
                  checked={selected.includes(option)}
                  readOnly
                  className="mr-2"
                />
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
