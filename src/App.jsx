import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/Routes";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { WishlistProvider } from "./contexts/WishlistContext"; // Import WishlistProvider
import "./styles/App.css";

function App() {
    return (
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <WishlistProvider> {/* Wrap the app with WishlistProvider */}
                <div className="App">
                    <Navbar />
                    <AppRoutes />
                    <Footer />
                </div>
            </WishlistProvider>
        </Router>
    );
}

export default App;


