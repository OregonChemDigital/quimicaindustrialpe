import React, { useState, useEffect } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
// CSS imported via main.css

const TopContactBar = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            
            // Hide if scrolled down more than 50px, show if scrolled back to top
            if (currentScrollY > 50) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
            
            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    return (
        <div className={`top-contact-bar ${isVisible ? 'visible' : 'hidden'}`}>
            <div className="contact-info">
                <a href="tel:+51999999999" className="contact-item">
                    <FaPhone className="contact-icon" />
                    <span>+51 999 999 999</span>
                </a>
                <a href="mailto:contacto@quimicaindustrial.pe" className="contact-item">
                    <FaEnvelope className="contact-icon" />
                    <span>contacto@quimicaindustrial.pe</span>
                </a>
                <div className="contact-item">
                    <FaMapMarkerAlt className="contact-icon" />
                    <span>Lima, Perú</span>
                </div>
            </div>
        </div>
    );
};

export default TopContactBar; 