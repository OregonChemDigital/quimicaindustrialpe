import React from 'react';

import { Link, useNavigate } from 'react-router-dom';
import ImageCarousel from './ImageCarousel';
import { useWishlist } from '../contexts/WishlistContext';

const ProductPopup = ({ product, onClose, onAddToWishlist }) => {
    const navigate = useNavigate();
    const { wishlist, addToWishlist } = useWishlist();

    const handleAddToWishlist = () => onAddToWishlist(product);

    const handleCotizar = () => {
        if (!wishlist.some(item => item._id === product._id)) {
            addToWishlist(product);
        }
        onClose();
        navigate('/cotizar');
    };

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
    // Only include product image if it exists, then add presentation images
    const carouselImages = [
        ...(product.image ? [product.image] : []), // Only include product image if it exists
        ...(product.presentations || [])
            .map(p => p.image) // Get site1 images from presentations
            .filter(Boolean) // Remove any null/undefined values
    ];

    return (
        <div className="popup-overlay" onClick={onClose}>
            <div className="popup-card" onClick={(e) => e.stopPropagation()}>
                <div className="popup-left">
                    <ImageCarousel images={carouselImages} />
                    <div className="referential-images-message" style={{margin: '8px 0 0 0', fontSize: '0.95rem', color: '#555', textAlign: 'center'}}>
                        *Todas las imagenes son referenciales
                    </div>
                </div>
                <div className="popup-right">
                    <h2>{product.name}</h2>
                    {product.price && (
                        <div className="product-price">
                            <strong>Precio: S/. {product.price.toFixed(2)}</strong>
                        </div>
                    )}
                    {product.presentations && product.presentations.length > 0 && (
                        <div style={{ textAlign: 'left' }}>
                            {renderProductInfo(
                                "Presentaciones Disponibles", 
                                product.presentations.map(p =>`${p.name}`).join(", ")
                            )}
                        </div>
                    )}
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
                        <button 
                            className="btn-secondary btn"
                            onClick={handleCotizar}
                        >
                            Cotizar
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