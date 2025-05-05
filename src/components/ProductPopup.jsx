import React from 'react';
import '../styles/ProductPopup.css';
import { Link, useNavigate } from 'react-router-dom';
import ImageCarousel from './ImageCarousel';

const ProductPopup = ({ product, onClose, onAddToWishlist }) => {
    const navigate = useNavigate();
    const handleAddToWishlist = () => onAddToWishlist(product);

    const handleViewDetails = () => {
        onClose();
        navigate(`/productos/${product.slug}`);
    };

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
                            product.presentations.map(p =>`${p.name}`).join(", ")
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
                        <button 
                            className="btn-secondary btn"
                            onClick={handleViewDetails}
                        >
                            Ver más detalles
                        </button>
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