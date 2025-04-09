import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { fetchCategories } from "../services/categoryService";
import { analytics } from '../firebase';
import { logEvent } from 'firebase/analytics';
import { trackHeroCotizarClick, trackFeaturedCotizarClick } from '../utils/analytics';
import BannerCarousel from "./BannerCarousel";
import "../styles/HomePage.css";

const HomePage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadCategories = useCallback(async () => {
        try {
            setLoading(true);
            const data = await fetchCategories();
            setCategories(data);
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

    const renderCategoryCard = useCallback((category) => (
        <Link
            key={category._id}
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
                />
                <div
                    className="category-card-back"
                    style={{
                        backgroundImage: `url(${category.images?.site1})`,
                    }}
                >
                    <h4 className="category-name">{category.name}</h4>
                </div>
            </div>
        </Link>
    ), []);

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

        return (
            <section className="homepage-categories section-spacing" role="navigation">
                <div className="category-grid">
                    <div className="category-card first-category">
                        <p className="category-label">
                            <strong>Descubre nuestra<br /> gama de productos.</strong>
                        </p>
                        <p className="category-title">Categorías</p>
                        <p className="category-description">
                            Poseemos una gama de preservantes, Aditivos alimenticios, Reguladores de Acidez,
                            Detergentes, Aceites Lubricantes, ácidos, Industria Textil, Industria Pesquera, entre otros.
                        </p>
                    </div>
                    {Array.isArray(categories) && [...categories]
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map(renderCategoryCard)}
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
            <BannerCarousel />
            {renderHeroSection()}
            {renderAboutSection()}
            {renderFeaturedSection()}
            {renderCategoriesSection()}
            {renderContactSection()}
        </main>
    );
};

export default HomePage;