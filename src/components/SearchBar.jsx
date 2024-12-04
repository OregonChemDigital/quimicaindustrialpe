import React, { useState, useEffect } from 'react';

const SearchBar = ({ options, value, onChange, placeholder }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [filteredOptions, setFilteredOptions] = useState([]);

    useEffect(() => {
        setFilteredOptions(
            options.filter(option =>
                option.name && option.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, options]);

    useEffect(() => {
        setSearchTerm('');
    }, [value]);

    const handleOptionClick = (option) => {
        onChange(option); 
        setSearchTerm('');
        setIsDropdownOpen(false);
    };

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleInputFocus = () => {
        setIsDropdownOpen(true);
    };

    const handleInputBlur = () => {
        setTimeout(() => setIsDropdownOpen(false), 100);
    };

    return (
        <div className="dropdown-container">
            <input
                type="text"
                value={isDropdownOpen ? searchTerm : value} 
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                className="dropdown-input"
                placeholder={placeholder}
            />
            {isDropdownOpen && filteredOptions.length > 0 && (
                <ul className="dropdown-list">
                    {filteredOptions.map((option) => (
                        <li
                            key={option.id || option._id || option.name}  
                            onMouseDown={() => handleOptionClick(option)}
                            className="dropdown-option"
                        >
                            {option.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchBar;