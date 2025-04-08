import React, { useEffect, useState, useCallback } from 'react';
import useBannerData from '../services/bannerService';
import "../styles/BannerCarousel.css";

const BannerCarousel = () => {
    const { banners, loading, error } = useBannerData();
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, [banners.length]);

    useEffect(() => {
        if (!Array.isArray(banners) || banners.length === 0) return;

        const interval = setInterval(nextSlide, 4000);
        return () => clearInterval(interval);
    }, [banners, nextSlide]);

    const renderBannerSlide = (banner, index) => (
        <div
            key={banner._id || index}
            className={`banner-slide ${index === currentIndex ? 'active' : ''}`}
            style={{ backgroundImage: `url(${banner.imageUrl || ''})` }}
            role="img"
            aria-label={`Banner ${index + 1}`}
        />
    );

    if (loading) {
        return (
            <div className="loading-banner" role="status">
                Cargando banners...
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

    if (!Array.isArray(banners) || banners.length === 0) {
        return (
            <div className="no-banners" role="status">
                Banners no disponibles...
            </div>
        );
    }

    return (
        <div className="banner-carousel" role="region" aria-label="Carrusel de banners">
            {banners.map(renderBannerSlide)}
        </div>
    );
};

export default BannerCarousel;