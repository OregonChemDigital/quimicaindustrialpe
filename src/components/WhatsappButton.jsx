import React, { useEffect, useRef } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { analytics } from '../firebase/firebase';
import { logEvent } from 'firebase/analytics';

const WhatsappButton = () => {
    const buttonRef = useRef(null);

    useEffect(() => {
        const button = buttonRef.current;
        if (!button) return;

        let scale = 1;
        let growing = true;
        
        const animate = () => {
            if (growing) {
                scale += 0.001; // Slower animation
                if (scale >= 1.08) growing = false; // Smaller scale range
            } else {
                scale -= 0.001; // Slower animation
                if (scale <= 1) growing = true;
            }
            
            button.style.transform = `scale(${scale})`;
            requestAnimationFrame(animate);
        };

        animate();

        // Stop animation on hover
        const handleMouseEnter = () => {
            button.style.animationPlayState = 'paused';
        };

        const handleMouseLeave = () => {
            button.style.animationPlayState = 'running';
        };

        button.addEventListener('mouseenter', handleMouseEnter);
        button.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            button.removeEventListener('mouseenter', handleMouseEnter);
            button.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <a
            ref={buttonRef}
            href="https://wa.me/+51951764731" // Replace with your real WhatsApp number
            onClick={() => logEvent(analytics, 'click_whatsapp')}
            className="whatsapp-button"
            target="_blank"
            rel="noopener noreferrer"
        >
            <FaWhatsapp style={{ 
            color: 'white', 
            fill: 'white',
            stroke: 'white',
            filter: 'brightness(0) invert(1)'
        }} />
        </a>
    );
}

export default WhatsappButton;
