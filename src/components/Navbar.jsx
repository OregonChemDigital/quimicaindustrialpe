import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaBox, FaPhone, FaClipboardList, FaShoppingBasket } from "react-icons/fa";
import LogoShort from "../assets/qiLogoShort.png";
import Logo from "../assets/logoNuevo.png";
import WishlistPopup from "./WishlistPopup";
import { useWishlist } from "../contexts/WishlistContext";
import "../styles/Navbar.css";
import { trackNavbarCotizarClick, trackNavbarProductosClick } from '../utils/analytics';
import SearchBar from "./SearchBar";
import { fetchProducts } from "../services/productService";

const Navbar = () => {
    const [showWishlist, setShowWishlist] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [currentPath, setCurrentPath] = useState('/');
    const [products, setProducts] = useState([]);
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

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const productsData = await fetchProducts();
                if (Array.isArray(productsData)) {
                    setProducts(productsData);
                }
            } catch (error) {
                console.error('Error loading products for search:', error);
            }
        };
        loadProducts();
    }, []);

    const renderDesktopNavbar = () => (
        <div className="navbar-container">
            <nav className={currentPath === "/" ? "navbar-home" : "navbar-default"}>
                <Link to="/">
                    <img className="logo" src={Logo.src} alt="Logo Química Industrial 2025" />
                </Link>
                <ul className="nav-list">
                    <li><Link to="/inicio">Inicio</Link></li>
                    <li><Link to="/productos" onClick={trackNavbarProductosClick}>Productos</Link></li>
                    <li><Link to="/contacto">Contacto</Link></li>
                    <li><Link to="/cotizar" onClick={trackNavbarCotizarClick}>Cotizar</Link></li>
                </ul>
                <SearchBar variant="navbar-unique" products={products} />
                <div className="social-icons">
                    <div className="basket-container">
                        <FaShoppingBasket className="heart-icon" onClick={handleWishlistClick} />
                        {wishlist.length > 0 && (
                            <span className="basket-counter">{wishlist.length}</span>
                        )}
                    </div>
                    <WishlistPopup 
                        isOpen={showWishlist} 
                        onClose={() => setShowWishlist(false)} 
                        items={wishlist}
                        onRemoveItem={removeFromWishlist}
                    />
                </div>
            </nav>
            <hr className="navbar-hr" />
        </div>
    );

    const renderMobileNavbar = () => (
        <div className="mobile-navbar">
            <Link to="/">
                <img className="mobile-logo" src={LogoShort.src} alt="Logo Química Industrial 2025" />
            </Link>
            <div className="mobile-icons">
                <Link to="/productos" onClick={trackNavbarProductosClick}>
                    <FaBox />
                </Link>
                <Link to="/contacto">
                    <FaPhone />
                </Link>
                <Link to="/cotizar" onClick={trackNavbarCotizarClick}>
                    <FaClipboardList />
                </Link>
                <div className="basket-container">
                    <FaHeart className="heart-icon" onClick={handleWishlistClick} />
                    {wishlist.length > 0 && (
                        <span className="basket-counter">{wishlist.length}</span>
                    )}
                </div>
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