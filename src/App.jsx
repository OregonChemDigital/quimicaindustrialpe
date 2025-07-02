import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/Routes";
import { analytics } from "./firebase";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { WishlistProvider } from "./contexts/WishlistContext";
import WhatsappButton from "./components/WhatsappButton";
import "./styles/index.css";
import "./styles/App.css";
import "./styles/global.css";

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