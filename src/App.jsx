import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/Routes";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { WishlistProvider } from "./contexts/WishlistContext";
import WhatsappButton from "./components/WhatsappButton";

// Import the organized CSS architecture
import "./styles/main.css";

const AppWrapper = () => (
    <WishlistProvider>
        <div className="App">
            <Navbar />
            <WhatsappButton />
            <AppRoutes />
            <Footer />
        </div>
    </WishlistProvider>
);

const ClientApp = () => (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppWrapper />
    </BrowserRouter>
);

export { AppWrapper, ClientApp };
export default ClientApp;