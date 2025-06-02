import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";

const SideBar = ({
    onSearch,
    onCategoryChange,
    onPresentationChange,
    placeholder,
    categories,
    presentations,
    selectedCategories
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [checkedCategories, setCheckedCategories] = useState(new Set(selectedCategories));

    useEffect(() => {
        setCheckedCategories(new Set(selectedCategories));
    }, [selectedCategories]);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        onSearch(value);
    };

    const handleCategoryCheckboxChange = (category) => {
        const updatedCheckedCategories = new Set(checkedCategories);
        if (updatedCheckedCategories.has(category)) {
            updatedCheckedCategories.delete(category);
        } else {
            updatedCheckedCategories.add(category);
        }
        setCheckedCategories(updatedCheckedCategories);
        onCategoryChange(category);
    };

    const handlePresentationCheckboxChange = (presentation) => {
        onPresentationChange(presentation);
    };

    // 🔤 Sort categories alphabetically
    const sortedCategories = Array.isArray(categories) 
        ? [...categories].sort((a, b) => a.name.localeCompare(b.name))
        : [];

    // 🔢 Extract numeric value first, followed by the unit (e.g., "kg", "L")
    const extractNumericValue = (str) => {
        const match = str.match(/[\d.,]+/);
        const unitMatch = str.match(/[a-zA-Z]+/);
        const numericValue = match ? parseFloat(match[0].replace(',', '.')) : Infinity;
        const unit = unitMatch ? unitMatch[0] : '';
        return { numericValue, unit };
    };

    // 🔢 Sort presentations: First by number, then by unit (e.g., "kg" comes after smaller values)
    const sortPresentations = (arr) =>
        [...arr].sort((a, b) => {
            const aValue = extractNumericValue(a.name);
            const bValue = extractNumericValue(b.name);

            if (aValue.numericValue === bValue.numericValue) {
                return aValue.unit.localeCompare(bValue.unit); // Compare unit if numeric value is the same
            }
            return aValue.numericValue - bValue.numericValue; // Otherwise, compare by numeric value
        });

    const solidos = sortPresentations(presentations.filter((pres) => pres.type === "solido"));
    const liquidos = sortPresentations(presentations.filter((pres) => pres.type === "liquido"));

    return (
        <div className="sidebar-container">
            <div className="search-bar-container">
                <div className="search-bar">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleInputChange}
                        className="dropdown-input"
                        placeholder={placeholder}
                    />
                    <FaSearch className="search-icon" />
                </div>
            </div>

            <div className="sidebar-content">
                <div className="category-filters">
                    <h3>Filtrar por Categoría</h3>
                    <hr />
                    {sortedCategories.map((category) => (
                        <div key={category._id} className="category-filter">
                            <input
                                type="checkbox"
                                id={category._id}
                                onChange={() => handleCategoryCheckboxChange(category.name)}
                                checked={checkedCategories.has(category.name)}
                            />
                            <label htmlFor={category._id}>{category.name}</label>
                        </div>
                    ))}
                </div>

                <div className="presentation-filters">
                    <h3>Filtrar por Presentación</h3>
                    <hr />
                    <div className="presentation-section">
                        <h4>Solidos</h4>
                        {solidos.map((presentation) => (
                            <div key={presentation._id} className="presentation-filter">
                                <input
                                    type="checkbox"
                                    id={presentation._id}
                                    onChange={() => handlePresentationCheckboxChange(presentation.name)}
                                />
                                <label htmlFor={presentation._id}>{presentation.name}</label>
                            </div>
                        ))}
                    </div>
                    <div className="presentation-section">
                        <h4>Liquidos</h4>
                        {liquidos.map((presentation) => (
                            <div key={presentation._id} className="presentation-filter">
                                <input
                                    type="checkbox"
                                    id={presentation._id}
                                    onChange={() => handlePresentationCheckboxChange(presentation.name)}
                                />
                                <label htmlFor={presentation._id}>{presentation.name}</label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SideBar;

