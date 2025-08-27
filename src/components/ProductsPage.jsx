import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchProducts } from "../services/productService";
import { fetchCategories } from "../services/categoryService";
import { fetchPresentations } from "../services/presentationService";
import SideBar from "./SideBar";
import ProductPopup from "./ProductPopup";
import { useWishlist } from "../contexts/WishlistContext";
import BannerCarousel from "./BannerCarousel";
import LoadingSpinner from "./LoadingSpinner";
import SuccessMessage from "./SuccessMessage";


import { FaHeart, FaEye, FaChevronLeft, FaChevronRight, FaShoppingBasket, FaCheck } from "react-icons/fa";

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
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 15;
    const { wishlist, addToWishlist } = useWishlist();
    const navigate = useNavigate();

    const query = useQuery();
    const selectedCategory = query.get("category");
    const searchParam = query.get("search");

    useEffect(() => {
        const loadProductsAndData = async () => {
            try {
                setLoading(true);
                setError(null);

                const [productsData, categoriesData, presentationsData] = await Promise.all([
                    fetchProducts(),
                    fetchCategories(),
                    fetchPresentations()
                ]);

                if (!Array.isArray(productsData) || !Array.isArray(categoriesData) || !Array.isArray(presentationsData)) {
                    throw new Error('Invalid data format received from API');
                }

                setProducts(productsData);
                setCategories(categoriesData);
                setPresentations(presentationsData);

                // If there's a search parameter, filter products immediately
                if (searchParam) {
                    const filtered = productsData.filter(product =>
                        product.name.toLowerCase().includes(searchParam.toLowerCase())
                    );
                    setFilteredProducts(filtered);
                } else {
                    setFilteredProducts(productsData);
                }

                if (selectedCategory) {
                    setSelectedCategories([selectedCategory]);
                }
            } catch (err) {
                console.error('Error loading data:', err);
                setError(err.message || 'Error al cargar los datos. Por favor, intente nuevamente.');
            } finally {
                setLoading(false);
            }
        };
        loadProductsAndData();
    }, [selectedCategory, searchParam]);

    // Handle search parameter from URL
    useEffect(() => {
        if (searchParam) {
            setSearchTerm(searchParam);
        }
    }, [searchParam]);

    useEffect(() => {
        if (selectedCategory) {
            const productSection = document.querySelector(".products-list");
            if (productSection) {
                productSection.scrollIntoView({ behavior: "smooth" });
            }
        }
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
        setCurrentPage(1); // Reset to first page when sorting changes
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
            filtered.sort((a, b) => {
                // Extract timestamp from MongoDB ObjectId
                const timestampA = parseInt(a._id.substring(0, 8), 16) * 1000;
                const timestampB = parseInt(b._id.substring(0, 8), 16) * 1000;
                return timestampB - timestampA; // Sort in descending order (newest first)
            });
        }

        setFilteredProducts(filtered);
        setCurrentPage(1);
    };

    const handleProductClick = (product) => {
        setSelectedProduct(product);
    };

    const closePopup = () => {
        setSelectedProduct(null);
    };

    const handleAddToWishlist = (product) => {
        // Ensure we have a valid product with _id
        if (!product || !product._id) {
            console.error('Invalid product:', product);
            return;
        }

        const alreadyInWishlist = wishlist.some(item => item._id === product._id);

        if (alreadyInWishlist) {
            setSuccessMessage(`${product.name} ya se encuentra en tu lista de favoritos`);
        } else {
            // Make sure we're adding the complete product object
            const productToAdd = {
                ...product,
                _id: product._id,
                name: product.name,
                image: product.image,
                presentations: product.presentations
            };
            addToWishlist(productToAdd);
            setSuccessMessage(`${product.name} añadido a favoritos`);
        }
        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
            setSuccessMessage("");
        }, 3000);
    };

    // Calculate pagination
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) {
        return (
            <div className="loading-overlay">
                <LoadingSpinner size="large" />
                <p>Cargando productos...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <h2>Error</h2>
                <p>{error}</p>
                <button
                    className="btn-primary"
                    onClick={() => window.location.reload()}
                >
                    Reintentar
                </button>
            </div>
        );
    }

    return (
        <div className="products-page">
            {/* ===== 1. HERO SECTION ===== */}
            <div className="products-hero">
                <div className="hero-content">
                    <h1 className="hero-title">Catálogo de Productos</h1>
                    <p className="hero-subtitle">Descubre nuestra amplia gama de productos químicos industriales de alta calidad</p>
                </div>
            </div>
            
            <div className="content-layout">

                {/* Sidebar */}
                <aside className="sidebar">
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

                {/* Main Content */}
                <main className="products-container">
                    <div className="filter-section">
                        <FaShoppingBasket className="heart-icon" />
                        <h3 className="filter-header">Agrega productos a la canasta de favoritos&nbsp;&nbsp;&nbsp;&nbsp;<br /> <strong>para solicitar una cotización</strong></h3>
                        <div className="filter-bar">
                            <label htmlFor="sort">Ordenar por:</label> <br />
                            <select id="sort" value={sortOption} onChange={handleSortChange}>
                                <option value="">Seleccione una opción</option>
                                <option value="az">A - Z</option>
                                <option value="za">Z - A</option>
                                <option value="recent">Recientemente añadidos</option>
                            </select>
                        </div>
                    </div>
                    <div className="referential-images-message" style={{margin: '8px 0 16px 0', fontSize: '0.95rem', color: '#555', textAlign: 'left'}}>
                        *Todas las imagenes son referenciales
                    </div>

                    {filteredProducts.length > 0 ? (
                        <>
                            <div className="product-cards-container">
                                {searchTerm && (
                                    <div className="product-card view-all-card" onClick={() => {
                                        setSearchTerm("");
                                        setSelectedCategories([]);
                                        setSelectedPresentations([]);
                                        setSortOption("");
                                        navigate("/productos");
                                    }}>
                                        <div className="view-all-content">
                                            <h2>Ver todos los productos</h2>
                                            <p>Hacer clic para ver el catálogo completo</p>
                                        </div>
                                    </div>
                                )}
                                {currentProducts.map((product) => (
                                    <div className="product-card" key={product._id}>
                                        {product.image && (
                                            <div className="image-container">
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="product-image"
                                                    onClick={() => handleProductClick(product)}
                                                />
                                                <FaEye 
                                                    className="eye-icon" 
                                                    onClick={() => handleProductClick(product)}
                                                />
                                                <span 
                                                    className="view-product-text"
                                                    onClick={() => handleProductClick(product)}
                                                >
                                                    Ver producto
                                                </span>
                                            </div>
                                        )}
                                        <h2>{product.name}</h2>
                                        {product.price && (
                                            <div className="product-price">
                                                <strong>S/. {product.price.toFixed(2)}</strong>
                                            </div>
                                        )}
                                        <button onClick={() => handleAddToWishlist(product)} className="btn btn-primary btn-add-product ">
                                            {wishlist.some(item => item._id === product._id) ? "Ya en tu canasta" : "Añadir a Favoritos"}
                                            &nbsp;&nbsp;
                                            {wishlist.some(item => item._id === product._id) ? <FaCheck /> : <FaShoppingBasket />}
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination Controls */}
                            <div className="pagination-controls">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="pagination-button"
                                >
                                    <FaChevronLeft />
                                </button>

                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`pagination-button ${currentPage === page ? 'active' : ''}`}
                                    >
                                        {page}
                                    </button>
                                ))}

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="pagination-button"
                                >
                                    <FaChevronRight />
                                </button>
                            </div>
                        </>
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
                {showSuccess && (
                    <SuccessMessage
                        message={successMessage}
                        onClose={() => setShowSuccess(false)}
                        duration={3000}
                    />
                )}

            </div>
            {/* Carousel */}
            <BannerCarousel />
        </div>
    );
};

export default ProductsPage;