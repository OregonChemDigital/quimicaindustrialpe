import React from 'react';
import '../styles/ProductPopup.css';

const ProductPopup = ({ product, onClose, onAddToWishlist }) => {
    const handleAddToWishlist = () => onAddToWishlist(product);

    const renderProductInfo = (label, content) => (
        <p>
            <strong>{label}:</strong> {content}
        </p>
    );

    return (
        <div className="popup-overlay" onClick={onClose}>
            <div className="popup-card" onClick={(e) => e.stopPropagation()}>
                <div className="popup-left">
                    <img 
                        src={product.image} 
                        alt={`Product ${product.name}`} 
                        className="popup-image" 
                    />
                </div>
                <div className="popup-right">
                    <h2>{product.name}</h2>
                    {renderProductInfo(
                        "Presentaciones Disponibles", 
                        product.presentations.map(p => `${p.name}${p.measure}`).join(", ")
                    )}
                    {renderProductInfo(
                        "Categorías", 
                        product.categories.map(c => c.name).join(", ")
                    )}
                    {renderProductInfo("Descripción", product.description)}
                    {renderProductInfo("Usos", product.use)}
                    <button 
                        className="btn-primary btn" 
                        onClick={handleAddToWishlist}
                    >
                        Añadir a Favoritos
                    </button>
                </div>
                <button 
                    className="popup-close" 
                    onClick={onClose}
                    aria-label="Cerrar popup"
                >
                    Cerrar
                </button>
            </div>
        </div>
    );
};

export default ProductPopup;