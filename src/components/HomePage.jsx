import React from "react";
import { Link } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";
import "../styles/HomePage.css";

const HomePage = () => {
  return (
    <div className="homepage">
      <header className="hero">
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
      </header>
      <section className="about">
        <div>
          <p>Nosotros</p>
          <h2>¿Quiénes Somos?</h2>
        </div>
        <div>
          <p>Parte de <strong>Oregon Chem Group</strong>,<br /> ofrecemos productos químicos<br /> y lubricantes industriales para<br /> <strong>industrias</strong> y <strong>particulares</strong> en el Perú</p>
          <Link to="/conocer" className="btn">Conoce Más</Link>
        </div>
      </section>
      <section className="featured">
        <div className="text">
          <p>INSUMOS PARA LA INDUSTRIA</p>
          <h3>Lideramos en <strong>químicos</strong> y<br /> <strong>lubricantes</strong>, mejorando procesos<br /> con <strong>soluciones confiables</strong>.</h3>
          <p>Poseemos una gama de preservantes, Aditivos alimenticios,<br /> Reguladores de Acidez, Detergentes, Aceites Lubricantes,<br /> ácidos, Industria Textil, Industria Pesquera, entre otros.</p>
          <Link to="/cotizar" className="btn">Cotizar Productos</Link>
        </div>
        <div className="image"></div>
      </section>
      <section className="categories">
        <div className="grid">
          <div className="category first-category">
            <h3>Categorías</h3>
            <p><strong>Descubre nuestra<br /> gama de productos.</strong></p>
            <p>Poseemos una gama de<br /> preservantes, Aditivos<br /> alimenticios, Reguladores de<br /> Acidez, Detergentes, Aceites<br /> Lubricantes, ácidos, Industria<br /> Textil, Industria Pesquera,<br /> entre otros.</p>
          </div>
          <div className="category"></div>
          <div className="category"></div>
          <div className="category"></div>
          <div className="category"></div>
          <div className="category"></div>
        </div>
        <Link to="/productos" className="btn">Ver Productos</Link>
      </section>
      <section className="contact">
        <div className="text">
          <p>QUÍMICA INDUSTRIAL PERÚ</p>
          <h3>Ponte en contacto <strong>con nosotros.</strong></h3>
          <p>Cuéntanos qué necesitas y te ayudaremos a encontrar la<br /> solución química ideal. Escríbenos y trabajemos juntos!</p>
          <Link to="/contacto" className="btn">Contáctanos</Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;



