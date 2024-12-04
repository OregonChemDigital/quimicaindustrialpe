import React from "react";
import Logo from "../assets/qiLogo.png";

const Footer = () => {
    return (
        <>
            <footer>
                <div>
                    <a href="/" target="_blank">
                        <img className="logo" src={Logo.src} alt="Logo Química Industrial 2024" />
                    </a>
                </div>
                <div>
                    <p>+511 644 0141</p>
                    <p>+511 961 555 000</p>
                    <p>contacto@quimicaindustrial.pe</p>
                    <p>Jr. Dante 236, Lima 15047, Perú</p>
                </div>
                <div>
                    <p>GGMJ - Lima, Perú</p>
                    <p>
                        Powered by{" "}
                        <a href="https://www.https://firebase.google.com/" target="_blank">
                            Google Firebase
                        </a>
                    </p>
                    <p>© 2016 - 2024 Química Industrial by Oregon Chem Group</p>
                </div>
            </footer>
        </>
    );
};

export default Footer;