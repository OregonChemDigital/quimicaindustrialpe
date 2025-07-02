import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProducts } from '../services/productService';
import ImageCarousel from './ImageCarousel';
import SearchBar from './SearchBar';
import { useWishlist } from '../contexts/WishlistContext';
import BannerCarousel from './BannerCarousel';
import SuccessMessage from './SuccessMessage';
import '../styles/SingleProductPage.css';
import '../styles/SuccessMessage.css';

const SingleProductPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const { wishlist, addToWishlist } = useWishlist();

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const productsData = await fetchProducts();
                setProducts(productsData);

                // Find the current product by slug
                const currentProduct = productsData.find(p => p.slug === slug);
                if (!currentProduct) {
                    setError('Producto no encontrado');
                    return;
                }
                setProduct(currentProduct);
            } catch (err) {
                setError('Error al cargar los productos: ' + err.message);
            } finally {
                setLoading(false);
            }
        };
        loadProducts();
    }, [slug]);

    const handleSearch = (searchTerm) => {
        const foundProduct = products.find(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (foundProduct) {
            navigate(`/productos/${foundProduct.slug}`);
        }
    };

    const navigateToProduct = (direction) => {
        const currentIndex = products.findIndex(p => p.slug === slug);
        if (currentIndex === -1) return;

        let newIndex;
        if (direction === 'prev') {
            newIndex = currentIndex === 0 ? products.length - 1 : currentIndex - 1;
        } else {
            newIndex = currentIndex === products.length - 1 ? 0 : currentIndex + 1;
        }
        navigate(`/productos/${products[newIndex].slug}`);
    };

    const handleAddToWishlist = () => {
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

    const handleCotizar = () => {
        // Ensure we have a valid product with _id
        if (!product || !product._id) {
            console.error('Invalid product:', product);
            return;
        }

        // Add the current product to the wishlist if it's not already there
        if (!wishlist.some(item => item._id === product._id)) {
            const productToAdd = {
                ...product,
                _id: product._id,
                name: product.name,
                image: product.image,
                presentations: product.presentations
            };
            addToWishlist(productToAdd);
            setSuccessMessage(`${product.name} añadido a favoritos`);
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                setSuccessMessage("");
            }, 3000);
        }
        // Navigate to the quote page
        navigate('/cotizar');
    };

    const renderProductInfo = (label, content) => {
        if (!content) return null;
        return (
            <div className="info-section">
                <h3>{label}</h3>
                <p>{content}</p>
            </div>
        );
    };

    if (loading) {
        return <div className="loading">Cargando...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (!product) {
        return <div className="error">Producto no encontrado</div>;
    }

    // Collect images for the carousel: product image + presentation images
    // Only include product image if it exists, then add presentation images
    const carouselImages = [
        ...(product.image ? [product.image] : []), // Only include product image if it exists
        ...(product.presentations || [])
            .map(p => p.image)
            .filter(Boolean)
    ];

    return (
        <div className="single-product-page">
            <div className="search-container">
                <SearchBar onSearch={handleSearch} />
                <div className="product-navigation">
                    <button
                        className="nav-button prev"
                        onClick={() => navigateToProduct('prev')}
                        aria-label="Producto anterior"
                    >
                        ←
                    </button>
                    <button
                        className="nav-button next"
                        onClick={() => navigateToProduct('next')}
                        aria-label="Siguiente producto"
                    >
                        →
                    </button>
                </div>
            </div>

            <div className="product-grid">
                <div>
                    <ImageCarousel images={carouselImages} />
                    <div className="referential-images-message" style={{margin: '8px 0 0 0', fontSize: '0.95rem', color: '#555', textAlign: 'center'}}>
                        *Todas las imagenes son referenciales
                    </div>
                </div>

                <div className="product-basic-info">
                    <h2>{product.name}</h2>
                    {product.price && (
                        <div className="product-price">
                            <h3>Precio: S/. {product.price.toFixed(2)}</h3>
                        </div>
                    )}
                    {product.presentations && product.presentations.length > 0 && (
                        <div className="presentations" style={{ textAlign: 'left', color: '#222' }}>
                            <h3>Presentaciones Disponibles</h3>
                            <p>{product.presentations.map(p => `${p.name}`).join(", ")}</p>
                        </div>
                    )}
                    {product.categories && product.categories.length > 0 && (
                        <div className="categories" style={{ textAlign: 'left', color: '#222' }}>
                            <h3>Categorías</h3>
                            <p>{product.categories.map(c => c.name).join(", ")}</p>
                        </div>
                    )}
                    {product.description && (
                        <div className="description" style={{ textAlign: 'left', color: '#222' }}>
                            <h3>Descripción</h3>
                            <p>{product.description}</p>
                        </div>
                    )}
                    {product.use && (
                        <div className="uses" style={{ textAlign: 'left', color: '#222' }}>
                            <h3>Usos</h3>
                            <p>{product.use}</p>
                        </div>
                    )}
                    <div className="product-actions">
                        <button 
                            className="btn-primary"
                            onClick={handleAddToWishlist}
                        >
                            {wishlist.some(item => item._id === product._id) ? "Ya en tu canasta" : "Añadir a Favoritos"}
                        </button>
                        <button 
                            className="btn-secondary"
                            onClick={handleCotizar}
                        >
                            Cotizar
                        </button>
                    </div>
                </div>
            </div>

            <div className="back-to-products">
                <button 
                    className="btn-secondary"
                    onClick={() => navigate('/productos')}
                >
                    Volver a todos los productos
                </button>
            </div>

            <BannerCarousel />
            {showSuccess && (
                <SuccessMessage
                    message={successMessage}
                    onClose={() => setShowSuccess(false)}
                    duration={3000}
                />
            )}
        </div>
    );
};

export default SingleProductPage; 