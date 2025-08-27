import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';


import { analytics } from '../firebase/firebase';
import { logEvent } from 'firebase/analytics';

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
