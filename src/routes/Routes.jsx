import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "../components/HomePage.jsx";
import ContactPage from "../components/ContactPage.jsx";
import QuotePage from "../components/QuotePage.jsx";
import ProductsPage from "../components/ProductsPage.jsx";
import SingleProductPage from "../components/SingleProductPage.jsx";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/inicio" element={<HomePage />} />
            <Route path="/contacto" element={<ContactPage />} />
            <Route path="/productos" element={<ProductsPage />} />
            <Route path="/productos/:slug" element={<SingleProductPage />} />
            <Route path="/cotizar" element={<QuotePage />} />
        </Routes>
    );
};

export default AppRoutes;