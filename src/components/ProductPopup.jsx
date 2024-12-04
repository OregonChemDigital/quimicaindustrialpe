import React from 'react';
import '../styles/ProductPopup.css';

const ProductPopup = ({ product, onClose, onAddToWishlist }) => {
    return (
        <div className="popup-overlay" onClick={onClose}>
            <div className="popup-card" onClick={(e) => e.stopPropagation()}>
                <div className="popup-left">
                    <img src={product.image} alt={`Product ${product.name}`} className="popup-image" />
                </div>
                <div className="popup-right">
                    <h2>{product.name}</h2>
                    <p><strong>Presentaciones Disponibles:</strong> {product.presentations.map(p => `${p.name}${p.measure}`).join(", ")}</p>
                    <p><strong>Categorías:</strong> {product.categories.map(c => c.name).join(", ")}</p>
                    <p><strong>Descripción:</strong> {product.description}</p>
                    <p><strong>Usos:</strong> {product.use}</p>
                    <button onClick={() => onAddToWishlist(product)}>Añadir a Favoritos</button>
                </div>
                <button className="popup-close" onClick={onClose}>Cerrar</button>
            </div>
        </div>
    );
};

export default ProductPopup;

