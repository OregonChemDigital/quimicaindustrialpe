import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { analytics } from '../firebase'; // Updated path
import { logEvent } from 'firebase/analytics';
import { trackWishlistCotizarClick, trackWishlistPopupOpen } from '../utils/analytics';
import '../styles/WishlistPopup.css';

const WishlistPopup = ({ isOpen, onClose, items }) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen) {
            trackWishlistPopupOpen();
        }
    }, [isOpen]);

    const handleCotizarClick = () => {
        trackWishlistCotizarClick();
        navigate('/cotizar');
    };

    if (!isOpen) return null;

    const renderWishlistItems = () => {
        if (items.length === 0) {
            return <p className="empty-message">No hay productos en tu lista de cotización</p>;
        }

        return items.map((item) => (
            <div key={item._id} className="wishlist-item">
                <span className="item-name">{item.name}</span>
            </div>
        ));
    };

    return (
        <div className="wishlist-popup-overlay" onClick={onClose}>
            <div className="wishlist-popup" onClick={e => e.stopPropagation()}>
                <div className="wishlist-popup-content">
                    <h2>Tu Lista de Cotización</h2>
                    <div className="wishlist-items">
                        {renderWishlistItems()}
                    </div>
                    <div className="wishlist-actions">
                        {items.length > 0 && (
                            <button 
                                onClick={handleCotizarClick}
                                className="cta-button"
                            >
                                Cotizar
                            </button>
                        )}
                        <button onClick={onClose} className="close-button">
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WishlistPopup;