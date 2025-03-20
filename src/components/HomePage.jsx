import React from "react";
import { Link } from "react-router-dom";
import BackgroundImage from "../assets/homePageImage1.png"; // Make sure this points to your actual image
import { FaWhatsapp } from "react-icons/fa";

const HomePage = () => {
  return (
    <>
      <body>
        <header className="hero">
          <div
          // className="hero-section"
          // style={{
          //   backgroundImage: `url(${BackgroundImage.src})`,
          // }}
          >
            {/* Hero Content */}
            <div className="hero-content">
              <h1>Venta de Productos <br />
              Químicos en el Perú</h1>
              <p>Lorem ipsum dolor sit amet consectetur adipiscing</p>
              {/* "Cotiza Aquí" Button */}
              <Link to="/cotizar" className="btn">
                Cotiza Aquí
              </Link>
            </div>
            {/* WhatsApp Floating Button */}
            <a
              href="https://wa.me/+51951764731" // Replace with your real WhatsApp number
              className="whatsapp-button"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp />
            </a>
          </div>
        </header>
        <section class="about">
          <h2>¿Quiénes Somos?</h2>
          <p>Parte de <strong>Oregon Chem Group</strong>, ofrecemos productos químicos y lubricantes industriales.</p>
          <a href="#" class="btn">Conoce más</a>
        </section>
        <section class="featured">
          <div class="text">
            <h3>Lideramos en <strong>químicos</strong> y <strong>lubricantes</strong></h3>
            <p>Mejorando procesos con soluciones confiables.</p>
            <a href="#" class="btn">Cotizar Productos</a>
          </div>
          <div class="image"></div>
        </section>
        <section class="categories">
          <h3>Categorías</h3>
          <p>Descubre nuestra gama de productos.</p>
          <div class="grid">
            <div class="category"></div>
            <div class="category"></div>
            <div class="category"></div>
            <div class="category"></div>
          </div>
          <a href="#" class="btn">Ver Productos</a>
        </section>
        <section class="contact">
          <h3>Ponte en contacto <strong>con nosotros</strong></h3>
          <p>Cuéntanos qué necesitas y te ayudaremos.</p>
          <a href="#" class="btn">Contáctanos</a>
        </section>
      </body>
    </>
  );
};

export default HomePage;



