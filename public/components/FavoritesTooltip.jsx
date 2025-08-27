import React, { useEffect, useState } from 'react';
// CSS imported via main.css
import { FaShoppingBasket, FaTimes } from 'react-icons/fa';

const FavoritesTooltip = ({ onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Check if user has seen the tooltip before
        const hasSeenTooltip = localStorage.getItem('hasSeenFavoritesTooltip');
        if (hasSeenTooltip) {
            setIsVisible(false);
        }
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        localStorage.setItem('hasSeenFavoritesTooltip', 'true');
        onClose?.();
    };

    if (!isVisible) return null;

    return (
        <div className="favorites-tooltip">
            <button className="tooltip-close" onClick={handleClose}>
                <FaTimes />
            </button>
            <div className="tooltip-content">
                <div className="tooltip-icon">
                    <FaShoppingBasket />
                </div>
                <h3>¡Bienvenido a nuestro catálogo!</h3>
                <p>
                    Puedes guardar tus productos favoritos haciendo clic en el botón de "Añadir a favoritos"
                    <FaShoppingBasket className="inline-icon" />. Estos productos se guardarán automáticamente
                    en la canasta a mano izquierda de la parte superior de la página. Así podrás acceder a ellos
                    más tarde para solicitar una cotización. En cualquier caso, al navegar a la misma página de
                    cotización, estos productos se encontrarán auto-completados en el formulario.
                </p>
                <button className="tooltip-button" onClick={handleClose}>
                    Entendido
                </button>
            </div>
        </div>
    );
};

export default FavoritesTooltip; 