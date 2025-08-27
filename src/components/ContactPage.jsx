import { useState, useEffect } from 'react';
import { SocialIcon } from "react-social-icons";
import { trackPageView, safeLogEvent } from '../utils/analytics';
import LoadingSpinner from './LoadingSpinner';
import { FaMapMarkerAlt, FaClock, FaPhone, FaWhatsapp, FaEnvelope } from 'react-icons/fa';
import React from 'react'; // Added missing import for React

const ContactPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadPage = async () => {
            try {
                setIsLoading(true);
                trackPageView('Contact Page');
                console.log('ContactPage component loaded!');
            } catch (err) {
                setError('Error loading contact information');
                if (process.env.NODE_ENV === 'development') {
                    console.error('Contact page error:', err);
                }
            } finally {
                setIsLoading(false);
            }
        };

        loadPage();
    }, []);

    const contactInfo = {
        address: "Jr. Dante 236, Lima 15047, Perú",
        hours: "Lunes - Viernes: 8:00 AM - 5:00 PM",
        phone: "(+51) 1 644 0141",
        whatsapp: "(+51) 933 634 055",
        email: "contacto@quimicaindustrial.pe"
    };

    const socialLinks = [
        { network: "whatsapp", url: `https://wa.me/${contactInfo.whatsapp.replace(/\D/g, '')}`, label: "WhatsApp" },
        { network: "facebook", url: "https://facebook.com/quimicaindustrialpe", label: "Facebook" },
        { network: "instagram", url: "https://instagram.com/quimicaindustrialpe", label: "Instagram" },
        { network: "email", url: `mailto:${contactInfo.email}`, label: "Email" }
    ];

    const handleSocialClick = (network, url) => {
        safeLogEvent('social_click', {
            network,
            page: 'contact'
        });
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const renderHeroSection = () => {
        console.log('Rendering hero section with CSS classes');
        
        return (
            <section className="contact-hero">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Ponte en Contacto
                    </h1>
                    <p className="hero-subtitle">
                        Estamos aquí para ayudarte con todas tus necesidades químicas. 
                        Contáctanos y trabajemos juntos.
                    </p>
                </div>
            </section>
        );
    };

    const renderMap = () => (
        <div className="map-section">
            <div className="section-header">
                <h2 className="section-title">Nuestra Ubicación</h2>
                <p className="section-description">
                    Visítanos en nuestro local en el corazón de Lima
                </p>
            </div>
            <div className="map-container">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3900.9152160887134!2d-77.02256539999999!3d-12.117953399999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c8101aa54473%3A0x2b212b1faca265d6!2sJr.%20Dante%20236%2C%20Lima%2015047!5e0!3m2!1sen!2spe!4v1723852188797!5m2!1sen!2spe"
                    width="100%"
                    height="450"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Ubicación de Química Industrial Perú"
                    aria-label="Mapa de ubicación"
                />
            </div>
        </div>
    );

    const renderSocialIcons = () => (
        <div className="social-section">
            <div className="section-header">
                <h2 className="section-title">Síguenos en Redes Sociales</h2>
                <p className="section-description">
                    Mantente conectado con nosotros
                </p>
            </div>
            <div className="contact-social-icons" role="navigation" aria-label="Redes sociales">
                {socialLinks.map(({ network, url, label }) => (
                    <button
                        key={network}
                        className="social-icon-button"
                        onClick={() => handleSocialClick(network, url)}
                        aria-label={`${label} de Química Industrial Perú`}
                    >
                        <SocialIcon network={network} />
                        <span className="social-label">{label}</span>
                    </button>
                ))}
            </div>
        </div>
    );

    const renderContactInfo = () => (
        <div className="contact-info-section">
            <div className="section-header">
                <h2 className="section-title">Información de Contacto</h2>
                <p className="section-description">
                    Estamos disponibles para atenderte
                </p>
            </div>
            <div className="contact-cards">
                <div className="contact-card">
                    <div className="contact-card-header">
                        <div className="contact-icon">
                            <FaMapMarkerAlt />
                        </div>
                        <div className="contact-content">
                            <h3>Dirección</h3>
                        </div>
                    </div>
                    <p>{contactInfo.address}</p>
                </div>

                <div className="contact-card">
                    <div className="contact-card-header">
                        <div className="contact-icon">
                            <FaClock />
                        </div>
                        <div className="contact-content">
                            <h3>Horarios</h3>
                        </div>
                    </div>
                    <p>{contactInfo.hours}</p>
                </div>

                <div className="contact-card">
                    <div className="contact-card-header">
                        <div className="contact-icon">
                            <FaPhone />
                        </div>
                        <div className="contact-content">
                            <h3>Teléfono</h3>
                        </div>
                    </div>
                    <p>{contactInfo.phone}</p>
                </div>

                <div className="contact-card">
                    <div className="contact-card-header">
                        <div className="contact-icon">
                            <FaWhatsapp />
                        </div>
                        <div className="contact-content">
                            <h3>WhatsApp</h3>
                        </div>
                    </div>
                    <p>{contactInfo.whatsapp}</p>
                </div>

                <div className="contact-card">
                    <div className="contact-card-header">
                        <div className="contact-icon">
                            <FaEnvelope />
                        </div>
                        <div className="contact-content">
                            <h3>Email</h3>
                        </div>
                    </div>
                    <p>{contactInfo.email}</p>
                </div>
            </div>
        </div>
    );

    if (error) {
        return (
            <div className="error-container" role="alert">
                <h2>Error</h2>
                <p>{error}</p>
                <button onClick={() => setError(null)}>Try Again</button>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="loading-overlay">
                <LoadingSpinner size="medium" />
                <p>Cargando información de contacto...</p>
            </div>
        );
    }

    return (
        <div className="contact-page" role="main">
            {renderHeroSection()}
            <div className="contact-content">
                <div className="contact-left-column">
                    {renderMap()}
                    {renderSocialIcons()}
                </div>
                <div className="contact-sidebar">
                    {renderContactInfo()}
                </div>
            </div>
        </div>
    );
};

export default ContactPage;