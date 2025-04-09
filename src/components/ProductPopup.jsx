import React from 'react';
import '../styles/ProductPopup.css';
import { Link } from 'react-router-dom';
import ImageCarousel from './ImageCarousel';

const ProductPopup = ({ product, onClose, onAddToWishlist }) => {
    const handleAddToWishlist = () => onAddToWishlist(product);

    const renderProductInfo = (label, content) => {
        if (!content) return null;
        return (
            <p>
                <strong>{label}:</strong> {content}
            </p>
        );
    };

    // Collect images for the carousel: product image + presentation images
    const carouselImages = [
        product.image, // Main product image (site1)
        ...(product.presentations || [])
            .map(p => p.image) // Get site1 images from presentations
            .filter(Boolean) // Remove any null/undefined values
    ];

    console.log('Product:', product);
    console.log('Carousel Images:', carouselImages);

    return (
        <div className="popup-overlay" onClick={onClose}>
            <div className="popup-card" onClick={(e) => e.stopPropagation()}>
                <div className="popup-left">
                    <ImageCarousel images={carouselImages} />
                </div>
                <div className="popup-right">
                    <h2>{product.name}</h2>
                    {product.presentations && product.presentations.length > 0 && (
                        renderProductInfo(
                            "Presentaciones Disponibles", 
                            product.presentations.map(p => `${p.name}${p.measure || ''}`).join(", ")
                        )
                    )}
                    {product.categories && product.categories.length > 0 && (
                        renderProductInfo(
                            "Categorías", 
                            product.categories.map(c => c.name).join(", ")
                        )
                    )}
                    {renderProductInfo("Descripción", product.description)}
                    {renderProductInfo("Usos", product.use)}
                    <div className="popup-actions">
                        <button 
                            className="btn-primary btn" 
                            onClick={handleAddToWishlist}
                        >
                            Añadir a Favoritos
                        </button>
                        <Link 
                            to={`/productos/${product.slug}`}
                            className="btn-secondary btn"
                            onClick={onClose}
                        >
                            Ver más detalles
                        </Link>
                    </div>
                </div>
                <button 
                    className="popup-close" 
                    onClick={onClose}
                    aria-label="Cerrar popup"
                >
                    X
                </button>
            </div>
        </div>
    );
};

export default ProductPopup;