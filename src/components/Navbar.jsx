import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/qiLogo.png";
import { FaHeart } from 'react-icons/fa';
import WishlistPopup from "./WishlistPopup";
import { useWishlist } from "../contexts/WishlistContext";

const Navbar = () => {
    const [showWishlist, setShowWishlist] = useState(false);
    const { wishlist, removeFromWishlist } = useWishlist();

    const handleWishlistClick = () => {
        setShowWishlist(!showWishlist);
    };

    return (
        <nav>
            <div>
                <Link to="/">
                    <img className="logo" src={Logo.src} alt="Logo Química Industrial 2025" />
                </Link>
            </div>
            <div>
                <ul className="nav-list">
                    <li><Link to="/inicio">Inicio</Link></li>
                    <li><Link to="/productos">Productos</Link></li>
                    <li><Link to="/contacto">Contacto</Link></li>
                    <li><Link to="/cotizar">Cotizar</Link></li>
                </ul>
            </div>
            <div className="social-icons">
                <FaHeart className="heart-icon" onClick={handleWishlistClick} />
                {showWishlist && (
                    <div className="wishlist-popup-container">
                        <WishlistPopup wishlist={wishlist} handleRemoveFromWishlist={removeFromWishlist} />
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;




