import React, { useEffect, useState, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { fetchCategories } from "../services/categoryService";
import { analytics } from '../firebase';
import { logEvent } from 'firebase/analytics';
import { trackHeroCotizarClick, trackFeaturedCotizarClick } from '../utils/analytics';
import BannerCarousel from "./BannerCarousel";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
// CSS imported via main.css

const HomePage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCategoryArrows, setShowCategoryArrows] = useState(false);
    const categoryGridRef = useRef(null);
    const scrollIntervalRef = useRef(null);
    const [currentPosition, setCurrentPosition] = useState(0);

    const loadCategories = useCallback(async () => {
        try {
            setLoading(true);
            const data = await fetchCategories();
            setCategories(data);
            // Set the CSS variable for total cards
            if (categoryGridRef.current) {
                categoryGridRef.current.style.setProperty('--total-cards', data.length);
            }
        } catch (err) {
            setError("Error al cargar las categorías. Por favor, intente nuevamente.");
            console.error('Error loading categories:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadCategories();
    }, [loadCategories]);

    const trackPageView = useCallback(() => {
        if (analytics) {
            logEvent(analytics, 'page_view', {
                page_title: 'Home',
                page_location: window.location.href,
                page_path: '/'
            });
        }
    }, []);

    useEffect(() => {
        trackPageView();
    }, [trackPageView]);

    const handleCotizarClick = useCallback((source) => {
        if (source === 'hero') {
            trackHeroCotizarClick();
        } else {
            trackFeaturedCotizarClick();
        }
        logEvent(analytics, 'click_cotiza_button', { source });
    }, []);

    const startAutoScroll = useCallback(() => {
        if (!categoryGridRef.current || !Array.isArray(categories) || categories.length === 0) return;

        scrollIntervalRef.current = setInterval(() => {
            if (categoryGridRef.current) {
                const cardWidth = 300; // card width + gap
                const maxScroll = cardWidth * categories.length;
                
                setCurrentPosition(prev => {
                    const newPosition = prev + 1;
                    if (newPosition >= maxScroll) {
                        // Reset to beginning without animation
                        categoryGridRef.current.style.transition = 'none';
                        setTimeout(() => {
                            if (categoryGridRef.current) {
                                categoryGridRef.current.style.transition = 'transform 0.3s ease-out';
                            }
                        }, 50);
                        return 0;
                    }
                    return newPosition;
                });
            }
        }, 30); // Update every 30ms for smooth scrolling
    }, [categories]);

    const stopAutoScroll = useCallback(() => {
        if (scrollIntervalRef.current) {
            clearInterval(scrollIntervalRef.current);
        }
    }, []);

    useEffect(() => {
        startAutoScroll();
        return () => stopAutoScroll();
    }, [startAutoScroll, stopAutoScroll]);

    useEffect(() => {
        if (categoryGridRef.current) {
            categoryGridRef.current.style.transform = `translateX(-${currentPosition}px)`;
        }
    }, [currentPosition]);

    const handleMouseEnter = useCallback(() => {
        setShowCategoryArrows(true);
        stopAutoScroll();
    }, [stopAutoScroll]);

    const handleMouseLeave = useCallback(() => {
        setShowCategoryArrows(false);
        startAutoScroll();
    }, [startAutoScroll]);

    const nextCategory = useCallback(() => {
        if (categoryGridRef.current) {
            const cardWidth = 300; // card width + gap
            setCurrentPosition(prev => {
                const newPosition = prev + cardWidth;
                const maxScroll = cardWidth * categories.length;
                if (newPosition >= maxScroll) {
                    // Reset to beginning without animation
                    categoryGridRef.current.style.transition = 'none';
                    setTimeout(() => {
                        if (categoryGridRef.current) {
                            categoryGridRef.current.style.transition = 'transform 0.3s ease-out';
                        }
                    }, 50);
                    return 0;
                }
                return newPosition;
            });
        }
    }, [categories.length]);

    const prevCategory = useCallback(() => {
        if (categoryGridRef.current) {
            const cardWidth = 300; // card width + gap
            setCurrentPosition(prev => {
                const newPosition = prev - cardWidth;
                if (newPosition < 0) {
                    // Jump to the end of the first set without animation
                    const maxScroll = cardWidth * categories.length;
                    categoryGridRef.current.style.transition = 'none';
                    setTimeout(() => {
                        if (categoryGridRef.current) {
                            categoryGridRef.current.style.transition = 'transform 0.3s ease-out';
                        }
                    }, 50);
                    return maxScroll - cardWidth;
                }
                return newPosition;
            });
        }
    }, [categories.length]);

    const renderHeroSection = () => (
        <section className="homepage-hero section-spacing" role="banner">
            <div className="hero-content">
                <h1 className="hero-title">
                    Venta de Productos <br />
                    Químicos en el Perú
                </h1>
                <p className="hero-description">Lorem ipsum dolor sit amet consectetur adipiscing</p>
                <Link
                    to="/cotizar"
                    className="hero-btn btn btn-primary"
                    onClick={() => handleCotizarClick('hero')}
                    aria-label="Cotizar productos químicos"
                >
                    Cotiza Aquí
                </Link>
            </div>
        </section>
    );

    const renderAboutSection = () => (
        <section className="homepage-about section-spacing" role="complementary">
            <div className="about-text">
                <p className="about-label">Nosotros</p>
                <h2 className="about-title">¿Quiénes Somos?</h2>
            </div>
            <div className="about-content">
                <p className="about-description">
                    Parte de <strong>Oregon Chem Group</strong>,<br />
                    ofrecemos productos químicos<br />
                    y lubricantes industriales para<br />
                    <strong>industrias</strong> y <strong>particulares</strong> en el Perú
                </p>
                <Link to="/conocer" className="btn btn-primary" aria-label="Conocer más sobre nosotros">
                    Conoce Más
                </Link>
            </div>
        </section>
    );

    const renderFeaturedSection = () => (
        <section className="homepage-featured section-spacing" role="complementary">
            <div className="featured-text">
                <p className="featured-label">INSUMOS PARA LA INDUSTRIA</p>
                <p className="featured-title">
                    Lideramos en <strong>químicos</strong> y<br />
                    <strong>lubricantes</strong>, mejorando procesos<br />
                    con <strong>soluciones confiables</strong>.
                </p>
                <p className="featured-description">
                    Poseemos una gama de preservantes, Aditivos alimenticios,<br />
                    Reguladores de Acidez, Detergentes, Aceites Lubricantes,<br />
                    ácidos, Industria Textil, Industria Pesquera, entre otros.
                </p>
                <Link
                    to="/cotizar"
                    className="featured-btn btn btn-primary"
                    onClick={() => handleCotizarClick('featured')}
                    aria-label="Cotizar productos químicos desde la sección destacada"
                >
                    Cotizar Productos
                </Link>
            </div>
            <div className="featured-image" role="img" aria-label="Productos químicos industriales"></div>
        </section>
    );

    const renderCategoriesSection = () => {
        if (loading) {
            return (
                <section className="homepage-categories section-spacing" role="status">
                    <p>Cargando categorías...</p>
                </section>
            );
        }

        if (error) {
            return (
                <section className="homepage-categories section-spacing" role="alert">
                    <p>{error}</p>
                    <button onClick={loadCategories} className="btn btn-primary">
                        Reintentar
                    </button>
                </section>
            );
        }

        // Sort categories and create a duplicated array for infinite scroll
        const sortedCategories = Array.isArray(categories) 
            ? [...categories].sort((a, b) => a.name.localeCompare(b.name))
            : [];
        const duplicatedCategories = [...sortedCategories, ...sortedCategories];

        return (
            <section className="homepage-categories section-spacing" role="navigation">
                <h3 className="category-section-header">Líneas de Productos</h3>
                <div 
                    className="category-grid-container"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <div 
                        ref={categoryGridRef}
                        className="category-grid"
                    >
                        {duplicatedCategories.map((category, index) => (
                            <Link
                                key={`${category._id}-${index}`}
                                to={`/productos?category=${encodeURIComponent(category.name)}`}
                                className="category-card flip-card"
                                aria-label={`Ver productos de la categoría ${category.name}`}
                            >
                                <div className="category-card-inner">
                                    <div
                                        className="category-card-front"
                                        style={{
                                            backgroundImage: `url(${category.images?.site1})`,
                                            backgroundSize: "cover",
                                            backgroundPosition: "center",
                                        }}
                                        role="img"
                                        aria-label={`Imagen de ${category.name}`}
                                    >
                                        <h4 className="category-name">{category.name}</h4>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    {showCategoryArrows && (
                        <>
                            <button 
                                className="category-arrow left-arrow" 
                                onClick={prevCategory}
                                aria-label="Categoría anterior"
                            >
                                <FaChevronLeft />
                            </button>
                            <button 
                                className="category-arrow right-arrow" 
                                onClick={nextCategory}
                                aria-label="Categoría siguiente"
                            >
                                <FaChevronRight />
                            </button>
                        </>
                    )}
                </div>
                <Link to="/productos" className="btn btn-primary" aria-label="Ver todos los productos">
                    Ver Productos
                </Link>
            </section>
        );
    };

    const renderContactSection = () => (
        <section className="homepage-contact section-spacing" role="complementary">
            <div className="contact-text">
                <p className="contact-label">QUÍMICA INDUSTRIAL PERÚ</p>
                <h3 className="contact-title">Ponte en contacto <strong>con nosotros.</strong></h3>
                <p className="contact-description">
                    Cuéntanos qué necesitas y te ayudaremos a encontrar la<br />
                    solución química ideal. Escríbenos y trabajemos juntos!
                </p>
                <Link to="/contacto" className="contact-btn btn btn-primary" aria-label="Contactar a Química Industrial Perú">
                    Contáctanos
                </Link>
            </div>
        </section>
    );

    return (
        <main role="main">
             
            {renderHeroSection()}
        
            <BannerCarousel />
            {renderCategoriesSection()}
           
            {renderAboutSection()}
            {renderFeaturedSection()}
            
            {renderContactSection()}
        </main>
    );
};

export default HomePage;