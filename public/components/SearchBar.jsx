import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// CSS imported via main.css
import { trackSearch } from '../utils/analytics';
import { FaSearch } from 'react-icons/fa';

const SearchBar = ({ onSearch, placeholder = "Buscar productos...", variant = 'default', products = [] }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const searchRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Reset search state when location changes
    useEffect(() => {
        setSearchTerm('');
        setSuggestions([]);
        setShowSuggestions(false);
        setSelectedIndex(-1);
    }, [location.pathname]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
                setSelectedIndex(-1);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        setSelectedIndex(-1);
        
        if (value.trim()) {
            const filteredProducts = products.filter(product =>
                product.name.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filteredProducts);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }

        if (onSearch) {
            onSearch(value);
        }
        trackSearch(value);
    };

    const handleSuggestionClick = (product) => {
        setSearchTerm(product.name);
        setShowSuggestions(false);
        setSelectedIndex(-1);
        navigate(`/productos/${product.slug}`);
    };

    const handleKeyDown = (e) => {
        if (!showSuggestions || suggestions.length === 0) {
            if (e.key === 'Enter' && searchTerm.trim()) {
                e.preventDefault();
                navigate(`/productos?search=${encodeURIComponent(searchTerm.trim())}`);
                // Reset search state after navigation
                setSearchTerm('');
                setSuggestions([]);
                setShowSuggestions(false);
                setSelectedIndex(-1);
            }
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev => 
                    prev < suggestions.length - 1 ? prev + 1 : prev
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0) {
                    handleSuggestionClick(suggestions[selectedIndex]);
                } else {
                    navigate(`/productos?search=${encodeURIComponent(searchTerm.trim())}`);
                    // Reset search state after navigation
                    setSearchTerm('');
                    setSuggestions([]);
                    setShowSuggestions(false);
                    setSelectedIndex(-1);
                }
                break;
            case 'Escape':
                setShowSuggestions(false);
                setSelectedIndex(-1);
                break;
            default:
                break;
        }
    };

    return (
        <div className={`search-bar ${variant}`} ref={searchRef}>
            <input
                type="text"
                value={searchTerm}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="search-input"
            />
            <FaSearch className="search-icon" />
            {showSuggestions && suggestions.length > 0 && (
                <div className="search-suggestions">
                    {suggestions.map((product, index) => (
                        <div
                            key={product._id}
                            className={`suggestion-item ${index === selectedIndex ? 'selected' : ''}`}
                            onClick={() => handleSuggestionClick(product)}
                        >
                            {product.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchBar; 