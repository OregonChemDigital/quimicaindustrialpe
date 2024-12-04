import { useState, useEffect } from "react";

const SideBar = ({ onSearch, onCategoryChange, onPresentationChange, placeholder, categories, presentations, selectedCategories }) => {
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        setCheckedCategories(new Set(selectedCategories));
    }, [selectedCategories]);

    const [checkedCategories, setCheckedCategories] = useState(new Set(selectedCategories));

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

    const solidos = presentations.filter(pres => pres.type === "solido");
    const liquidos = presentations.filter(pres => pres.type === "liquido");

    return (
        <div className="sidebar-container">
            <div className="search-bar">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleInputChange}
                    className="dropdown-input"
                    placeholder={placeholder}
                />
            </div>
            <div className="category-filters">
                <h3>Filtrar por Categoría</h3>
                {categories.map((category) => (
                    <div key={category._id} className="category-filter">
                        <input
                            type="checkbox"
                            id={category._id}
                            onChange={() => handleCategoryCheckboxChange(category.name)}
                            checked={checkedCategories.has(category.name)} // Set checkbox state
                        />
                        <label htmlFor={category._id}>{category.name}</label>
                    </div>
                ))}
            </div>
            <div className="presentation-filters">
                <h3>Filtrar por Presentación</h3>
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
    );
};

export default SideBar;




