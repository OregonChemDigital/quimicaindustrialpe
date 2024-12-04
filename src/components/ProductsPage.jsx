import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { fetchProducts } from "../services/productService";
import { fetchCategories } from "../services/categoryService";
import { fetchPresentations } from "../services/presentationService";
import SideBar from "./SideBar";
import ProductPopup from "./ProductPopup";
import { useWishlist } from "../contexts/WishlistContext";
import "../styles/ProductCard.css";
import "../styles/SideBar.css";
import "../styles/SuccessMessage.css";

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [presentations, setPresentations] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedPresentations, setSelectedPresentations] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");

    const { addToWishlist } = useWishlist();

    const query = useQuery();
    const selectedCategory = query.get("category");

    useEffect(() => {
        const loadProductsAndData = async () => {
            try {
                const productsData = await fetchProducts();
                const categoriesData = await fetchCategories();
                const presentationsData = await fetchPresentations();
                setProducts(productsData);
                setCategories(categoriesData);
                setPresentations(presentationsData);
                setFilteredProducts(productsData);

                if (selectedCategory) {
                    setSelectedCategories([selectedCategory]);
                }
            } catch (err) {
                setError("Error loading data: " + err.message);
            } finally {
                setLoading(false);
            }
        };
        loadProductsAndData();
    }, [selectedCategory]);

    useEffect(() => {
        filterProducts();
    }, [searchTerm, selectedCategories, selectedPresentations, sortOption]);

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    const handleCategoryChange = (category) => {
        setSelectedCategories((prev) =>
            prev.includes(category)
                ? prev.filter((c) => c !== category)
                : [...prev, category]
        );
    };

    const handlePresentationChange = (presentation) => {
        setSelectedPresentations((prev) =>
            prev.includes(presentation)
                ? prev.filter((p) => p !== presentation)
                : [...prev, presentation]
        );
    };

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

    const filterProducts = () => {
        let filtered = products.filter((product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (selectedCategories.length > 0) {
            filtered = filtered.filter((product) =>
                selectedCategories.every((category) =>
                    product.categories.map((cat) => cat.name).includes(category)
                )
            );
        }

        if (selectedPresentations.length > 0) {
            filtered = filtered.filter((product) =>
                selectedPresentations.every((presentation) =>
                    product.presentations.map((pres) => pres.name).includes(presentation)
                )
            );
        }

        if (sortOption === "az") {
            filtered.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortOption === "za") {
            filtered.sort((a, b) => b.name.localeCompare(a.name));
        } else if (sortOption === "recent") {
            filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        setFilteredProducts(filtered);
    };

    const handleProductClick = (product) => {
        setSelectedProduct(product);
    };

    const closePopup = () => {
        setSelectedProduct(null);
    };

    const handleAddToWishlist = (product) => {
        addToWishlist(product);
        setSuccessMessage(`${product.name} añadido a favoritos`);
        setTimeout(() => setSuccessMessage(""), 3000); // Clear message after 3 seconds
    };

    if (loading) return <p>Cargando productos...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="products-page">
            <aside className="sidebar">
                <h2>Buscar Productos</h2>
                <SideBar
                    options={products}
                    onSearch={handleSearch}
                    onCategoryChange={handleCategoryChange}
                    onPresentationChange={handlePresentationChange}
                    placeholder="Buscar productos..."
                    categories={categories}
                    presentations={presentations}
                    selectedCategories={selectedCategories}
                />
            </aside>
            <main className="products-container">
                <h1>Productos</h1>
                <div className="filter-bar">
                    <label htmlFor="sort">Ordenar por:</label>
                    <select id="sort" value={sortOption} onChange={handleSortChange}>
                        <option value="">Seleccione una opción</option>
                        <option value="az">A-Z</option>
                        <option value="za">Z-A</option>
                        <option value="recent">Recientemente añadido</option>
                    </select>
                </div>
                {filteredProducts.length > 0 ? (
                    <div className="product-cards-container">
                        {filteredProducts.map((product) => (
                            <div className="product-card" key={product._id}>
                                {product.image && (
                                    <img
                                        className="product-image"
                                        src={product.image}
                                        alt={`Product ${product.name}`}
                                        onClick={() => handleProductClick(product)}
                                    />
                                )}
                                <h2>{product.name}</h2>
                                <p>
                                    <strong>Presentaciones Disponibles:</strong>
                                    {product.presentations
                                        .map(
                                            (presentation) =>
                                                `${presentation.name}${presentation.measure}`
                                        )
                                        .join(", ")}
                                </p>
                                <button onClick={() => handleAddToWishlist(product)}>Añadir a Favoritos</button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No se encontraron productos.</p>
                )}
            </main>
            {selectedProduct && (
                <ProductPopup
                    product={selectedProduct}
                    onClose={closePopup}
                    onAddToWishlist={handleAddToWishlist}
                />
            )}
            {successMessage && <div className="success-message">{successMessage}</div>}
        </div>
    );
};

export default ProductsPage;









