import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { analytics } from '../firebase'; // Updated path
import { logEvent } from 'firebase/analytics';
import { trackWishlistCotizarClick, trackWishlistPopupOpen } from '../utils/analytics';
import LoadingSpinner from './LoadingSpinner';
import SuccessMessage from './SuccessMessage';
import '../styles/WishlistPopup.css';

const WishlistPopup = ({ isOpen, onClose, items, onRemoveItem }) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const popupRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            trackWishlistPopupOpen();
            // Add click outside handler
            const handleClickOutside = (event) => {z
                if (popupRef.current && !popupRef.current.contains(event.target)) {
                    onClose();
                }
            };
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [isOpen, onClose]);

    const handleCotizarClick = async () => {
        setIsLoading(true);
        try {
            trackWishlistCotizarClick();
            await new Promise(resolve => setTimeout(resolve, 1000));
            navigate('/cotizar');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveItem = async (itemId) => {
        setIsLoading(true);
        try {
            const itemToRemove = items.find(item => item._id === itemId);
            await new Promise(resolve => setTimeout(resolve, 800));
            onRemoveItem(itemId);
            setSuccessMessage(`${itemToRemove.name} eliminado de tu lista de favoritos`);
            setShowSuccess(true);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    const renderWishlistItems = () => {
        if (items.length === 0) {
            return <p className="empty-message">No hay productos en tu lista de favoritos</p>;
        }

        return items.map((item) => (
            <div key={item._id} className="wishlist-item">
                <span className="item-name">{item.name}</span>
                <button 
                    className="remove-item-button"
                    onClick={() => handleRemoveItem(item._id)}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <LoadingSpinner size="small" />
                    ) : (
                        '×'
                    )}
                </button>
            </div>
        ));
    };

    return (
        <>
            <div className="wishlist-popup" ref={popupRef}>
                <div className="wishlist-popup-content">
                    <h2>Tus Favoritos</h2>
                    <div className="wishlist-items">
                        {renderWishlistItems()}
                    </div>
                    <div className="wishlist-actions">
                        {items.length > 0 && (
                            <button 
                                onClick={handleCotizarClick}
                                className="cta-button"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <LoadingSpinner size="small" />
                                ) : (
                                    'Cotizar'
                                )}
                            </button>
                        )}
                        <button 
                            onClick={onClose} 
                            className="close-button"
                            disabled={isLoading}
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>

            {showSuccess && (
                <SuccessMessage
                    message={successMessage}
                    onClose={() => setShowSuccess(false)}
                    duration={3000}
                />
            )}
        </>
    );
};

export default WishlistPopup;