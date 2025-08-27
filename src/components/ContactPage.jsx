import { useState, useEffect } from 'react';
import { SocialIcon } from "react-social-icons";
import { trackPageView, safeLogEvent } from '../utils/analytics';
import LoadingSpinner from './LoadingSpinner';



const ContactPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadPage = async () => {
            try {
                setIsLoading(true);
                trackPageView('Contact Page');
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
        phone: "644 0141",
        whatsapp: "(+51) 933 634 055",
        email: "contacto@quimicaindustrial.pe"
    };

    const socialLinks = [
        { network: "whatsapp", url: `https://wa.me/${contactInfo.whatsapp.replace(/\D/g, '')}` },
        { network: "facebook", url: "https://facebook.com/quimicaindustrialpe" },
        { network: "instagram", url: "https://instagram.com/quimicaindustrialpe" },
        { network: "email", url: `mailto:${contactInfo.email}` }
    ];

    const handleSocialClick = (network, url) => {
        safeLogEvent('social_click', {
            network,
            page: 'contact'
        });
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const renderMap = () => (
        <div className="map-container">
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3900.9152160887134!2d-77.02256539999999!3d-12.117953399999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c8101aa54473%3A0x2b212b1faca265d6!2sJr.%20Dante%20236%2C%20Lima%2015047!5e0!3m2!1sen!2spe!4v1723852188797!5m2!1sen!2spe"
                width="500"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación de Química Industrial Perú"
                aria-label="Mapa de ubicación"
            />
        </div>
    );

    const renderSocialIcons = () => (
        <div className="contact-social-icons" role="navigation" aria-label="Redes sociales">
            {socialLinks.map(({ network, url }) => (
                <button
                    key={network}
                    className="social-icon-button"
                    onClick={() => handleSocialClick(network, url)}
                    aria-label={`${network} de Química Industrial Perú`}
                >
                    <SocialIcon network={network} />
                </button>
            ))}
        </div>
    );

    const renderContactInfo = () => (
        <div className="contact-info">
            <h4>Dirección</h4>
            <p>{contactInfo.address}</p>
            <h4>Horas</h4>
            <p>{contactInfo.hours}</p>
            <h4>Contacto</h4>
            <p>Teléfono: {contactInfo.phone}</p>
            <p>Whatsapp: {contactInfo.whatsapp}</p>
            <p>Correo electrónico: {contactInfo.email}</p>
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
        <div className="container" role="main">
            <div className="contact-container">
                {renderMap()}
                {renderSocialIcons()}
                {renderContactInfo()}
            </div>
        </div>
    );
};

export default ContactPage;