import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
// CSS imported via main.css

const WhatsappButton = () => {
    return (
        <a
            href="https://wa.me/+51951764731" // Replace with your real WhatsApp number
            onClick={() => logEvent(analytics, 'click_whatsapp')}
            className="whatsapp-button"
            target="_blank"
            rel="noopener noreferrer"
        >
            <FaWhatsapp />
        </a>
    );
}

export default WhatsappButton;
