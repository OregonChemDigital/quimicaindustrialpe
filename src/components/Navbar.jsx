import React, { useState, useEffect } from "react";
import { FaHeart, FaBox, FaPhone, FaClipboardList } from "react-icons/fa";
import LogoShort from "../assets/qiLogoShort.png";
import Logo from "../assets/qiLogo.png";
import WishlistPopup from "./WishlistPopup";
import { useWishlist } from "../contexts/WishlistContext";
import "../styles/Navbar.css";
import { trackNavbarCotizarClick, trackNavbarProductosClick } from '../utils/analytics';

const Navbar = () => {
    const [showWishlist, setShowWishlist] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [currentPath, setCurrentPath] = useState('/');
    const { wishlist, removeFromWishlist } = useWishlist();

    const handleWishlistClick = () => setShowWishlist(!showWishlist);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const updateLayout = () => {
                setIsMobile(window.innerWidth <= 768);
                setCurrentPath(window.location.pathname);
            };

            updateLayout();
            window.addEventListener("resize", updateLayout);
            return () => window.removeEventListener("resize", updateLayout);
        }
    }, []);

    const renderDesktopNavbar = () => (
        <div className="navbar-container">
            <nav className={currentPath === "/" ? "navbar-home" : "navbar-default"}>
                <div>
                    <a href="/">
                        <img className="logo" src={Logo.src} alt="Logo Química Industrial 2025" />
                    </a>
                </div>
                <ul className="nav-list">
                    <a href="/inicio">Inicio</a>
                    <a href="/productos" onClick={trackNavbarProductosClick}>Productos</a>
                    <a href="/contacto">Contacto</a>
                    <a href="/cotizar" onClick={trackNavbarCotizarClick}>Cotizar</a>
                </ul>
                <div className="social-icons">
                    <FaHeart className="heart-icon" onClick={handleWishlistClick} />
                    <WishlistPopup 
                        isOpen={showWishlist} 
                        onClose={() => setShowWishlist(false)} 
                        items={wishlist}
                        onRemoveItem={removeFromWishlist}
                    />
                </div>
            </nav>
        </div>
    );

    const renderMobileNavbar = () => (
        <div className="mobile-navbar">
            <a href="/">
                <img className="mobile-logo" src={LogoShort.src} alt="Logo Química Industrial 2025" />
            </a>
            <div className="mobile-icons">
                <a href="/productos" onClick={trackNavbarProductosClick}>
                    <FaBox />
                </a>
                <a href="/contacto">
                    <FaPhone />
                </a>
                <a href="/cotizar" onClick={trackNavbarCotizarClick}>
                    <FaClipboardList />
                </a>
                <FaHeart className="heart-icon" onClick={handleWishlistClick} />
                <WishlistPopup 
                    isOpen={showWishlist} 
                    onClose={() => setShowWishlist(false)} 
                    items={wishlist}
                    onRemoveItem={removeFromWishlist}
                />
            </div>
        </div>
    );

    return isMobile ? renderMobileNavbar() : renderDesktopNavbar();
};

export default Navbar;