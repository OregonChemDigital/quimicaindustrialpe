import React, { useState } from 'react';
import '../styles/SearchBar.css';
import { trackSearch } from '../utils/analytics';

const SearchBar = ({ onSearch, placeholder = "Buscar productos..." }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        onSearch(value);
        trackSearch(value);
    };

    return (
        <div className="search-bar">
            <input
                type="text"
                value={searchTerm}
                onChange={handleInputChange}
                placeholder={placeholder}
                className="search-input"
            />
        </div>
    );
};

export default SearchBar; 