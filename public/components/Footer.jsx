import React from "react";
import Logo from "../assets/logoNuevo.png";
// CSS imported via main.css

const Footer = () => {
    return (
        <div className="footer-container">
            <hr className="footer-hr" />
            <footer>
                <div>
                    <a href="/">
                        <img className="logo" src={Logo.src} alt="Logo Química Industrial 2025" />
                    </a>
                </div>
                <div>
                    <p>(+51) 1 644 0141</p>
                    <p>(+51) 933 634 055</p>
                    <p>contacto@quimicaindustrial.pe</p>
                    <p>Jr. Dante 236, Lima 15047, Perú</p>
                </div>
                <div>
                    <p>ggmj</p>
                    <p>Powered by <a href="https://firebase.google.com/" target="_blank">Google Firebase</a></p>
                    <p>© 2016 - 2025 Química Industrial by Oregon Chem Group</p>
                </div>
            </footer>
        </div>
    );
};

export default Footer;
