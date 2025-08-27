import React, { useState, useEffect, useCallback } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
// CSS imported via main.css

const BannerCarousel = () => {
    // For now, let's use a simple banner system until we have the banner service
    const [banners, setBanners] = useState([
        {
            _id: '1',
            imageUrl: '/assets/homePageImage1.png',
            createdAt: new Date().toISOString()
        }
    ]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showArrows, setShowArrows] = useState(false);

    // Sort banners from newest to oldest based on creation date
    const sortedBanners = [...banners].sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateB - dateA;
    });

    const nextSlide = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % sortedBanners.length);
    }, [sortedBanners.length]);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + sortedBanners.length) % sortedBanners.length);
    }, [sortedBanners.length]);

    useEffect(() => {
        if (!Array.isArray(sortedBanners) || sortedBanners.length === 0) return;

        const interval = setInterval(nextSlide, 4000);
        return () => clearInterval(interval);
    }, [sortedBanners, nextSlide]);

    const renderBannerSlide = (banner, index) => (
        <div
            key={banner._id || index}
            className={`banner-slide ${index === currentIndex ? 'active' : ''}`}
            style={{
                backgroundImage: `url(${banner.imageUrl || ''})`,
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
            role="img"
            aria-label={`Banner ${index + 1}`}
        />
    );

    if (loading) {
        return (
            <div className="loading-banner">
                <p>Cargando banners...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-banner" role="alert">
                Error al cargar los banners: {error.message}
            </div>
        );
    }

    if (!Array.isArray(sortedBanners) || sortedBanners.length === 0) {
        return (
            <div className="no-banners" role="status">
                Banners no disponibles...
            </div>
        );
    }

    return (
        <div 
            className="banner-carousel" 
            role="region" 
            aria-label="Carrusel de banners"
            onMouseEnter={() => setShowArrows(true)}
            onMouseLeave={() => setShowArrows(false)}
        >
            {sortedBanners.map(renderBannerSlide)}
            {showArrows && (
                <>
                    <button 
                        className="carousel-arrow left-arrow" 
                        onClick={prevSlide}
                        aria-label="Banner anterior"
                    >
                        <FaChevronLeft />
                    </button>
                    <button 
                        className="carousel-arrow right-arrow" 
                        onClick={nextSlide}
                        aria-label="Banner siguiente"
                    >
                        <FaChevronRight />
                    </button>
                </>
            )}
        </div>
    );
};

export default BannerCarousel;