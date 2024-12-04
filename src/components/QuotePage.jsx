import React, { useState, useEffect } from "react";
import "../styles/QuotePage.css";
import { fetchProducts } from "../services/productService";
import { useWishlist } from "../contexts/WishlistContext"; // Import the Wishlist context

const QuotePage = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [presentations, setPresentations] = useState([]);
    const [clientType, setClientType] = useState('');
    const [clientInfo, setClientInfo] = useState({
        name: '',
        lastName: '',
        dni: '',
        phone: '',
        email: '',
        company: '',
        socialReason: '',
        ruc: '',
    });
    const [contactMethod, setContactMethod] = useState('');
    const [observations, setObservations] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);

    const { wishlist } = useWishlist(); // Use the Wishlist context

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const data = await fetchProducts(); // This will now return the formatted array
                setProducts(data);
                setFilteredProducts(data); // Set the filteredProducts to the formatted data
            } catch (error) {
                console.error("Error loading products:", error);
            }
        };
        loadProducts();

        // Initialize selectedProducts with wishlist items
        if (wishlist.length > 0) {
            const initialSelectedProducts = wishlist.map(product => ({
                name: product.name,
                volume: '',
                presentation: '',
            }));
            setSelectedProducts(initialSelectedProducts);
        }
    }, [wishlist]);

    const handleProductSearch = (index, input) => {
        const newProducts = [...selectedProducts];
        newProducts[index].name = input;
        setSelectedProducts(newProducts);
        const product = products.find((p) => p.name === input);
        setPresentations(product?.presentations || []);
    };

    const handleVolumeChange = (index, volume) => {
        const newProducts = [...selectedProducts];
        newProducts[index].volume = volume;
        setSelectedProducts(newProducts);
    };

    const handleAddProductRow = () => {
        setSelectedProducts([...selectedProducts, { name: '', volume: '', presentation: '' }]);
    };

    const handleProductSelect = (index, presentationId) => {
        const newProducts = [...selectedProducts];
        newProducts[index].presentation = presentationId;
        setSelectedProducts(newProducts);
    };

    const handleRemoveProductRow = (index) => {
        const newProducts = selectedProducts.filter((_, i) => i !== index);
        setSelectedProducts(newProducts);
    };

    const handleClientInfoChange = (e) => {
        const { name, value } = e.target;
        setClientInfo((prev) => ({ ...prev, [name]: value }));
    };

    const handleContactMethodSelect = (method) => {
        setContactMethod(method);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            selectedProducts,
            clientType,
            clientInfo,
            contactMethod,
            observations,
            termsAccepted,
        };

        try {
            const response = await fetch('http://localhost:3000/quotes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                // Handle success (e.g., show a success message)
                console.log("Quote sent successfully");
            } else {
                // Handle error (e.g., show an error message)
                console.error("Error sending quote");
            }
        } catch (error) {
            console.error("Network error:", error);
        }
    };

    return (
        <div className="container">
            <h1>Cotizar</h1>
            <form className="quote-form" onSubmit={handleSubmit}>
                <div className="product-section">
                    {selectedProducts.map((product, index) => (
                        <div className="product-row" key={index}>
                            <div className="product-inputs">
                                <input
                                    type="text"
                                    placeholder="Buscar Producto"
                                    list={`product-options-${index}`}
                                    value={product.name}
                                    onChange={(e) => handleProductSearch(index, e.target.value)}
                                    onBlur={(e) => handleProductSearch(index, e.target.value)}
                                />
                                <datalist id={`product-options-${index}`}>
                                    {filteredProducts.map((prod) => (
                                        <option key={prod._id} value={prod.name} />
                                    ))}
                                </datalist>
                                <select
                                    onChange={(e) => handleProductSelect(index, e.target.value)}
                                    value={product.presentation}
                                >
                                    <option value="">Presentación</option>
                                    {presentations.map((presentation) => (
                                        <option key={presentation._id} value={presentation._id}>
                                            {presentation.name || presentation._id}
                                        </option>
                                    ))}
                                </select>
                                <input
                                    type="number"
                                    placeholder="Cantidad/Unidades"
                                    value={product.volume}
                                    onChange={(e) => handleVolumeChange(index, e.target.value)}
                                />
                                <select>
                                    <option value="">Única Compra</option>
                                    <option value="quincenal">Quincenal</option>
                                    <option value="mensual">Mensual</option>
                                    <option value="bimestral">Bimestral</option>
                                    <option value="trimestral">Trimestral</option>
                                </select>
                            </div>
                            <button
                                type="button"
                                className="remove-button"
                                onClick={() => handleRemoveProductRow(index)}
                            >
                                X
                            </button>
                        </div>
                    ))}

                    <button type="button" className="add-product" onClick={handleAddProductRow}>
                        Agregar Más Productos
                    </button>
                </div>

                <div className="client-section">
                    <div className="client-type">
                        <label>Tipo de cliente:</label>
                        <select value={clientType} onChange={(e) => setClientType(e.target.value)}>
                            <option value="">Persona Natural</option>
                            <option value="empresa">Empresa</option>
                            <option value="personaEmpresa">Persona con Empresa</option>
                        </select>
                    </div>
                    <div className="client-info">
                        <input type="text" name="name" placeholder="Nombre" value={clientInfo.name} onChange={handleClientInfoChange} />
                        <input type="text" name="lastName" placeholder="Apellidos" value={clientInfo.lastName} onChange={handleClientInfoChange} />
                        <input type="text" name="dni" placeholder="DNI" value={clientInfo.dni} onChange={handleClientInfoChange} />
                        <input type="text" name="phone" placeholder="Celular" value={clientInfo.phone} onChange={handleClientInfoChange} />
                        <input type="email" name="email" placeholder="Email" value={clientInfo.email} onChange={handleClientInfoChange} />
                        <input type="text" name="socialReason" placeholder="Razón Social" value={clientInfo.socialReason} onChange={handleClientInfoChange} />
                        <input type="text" name="ruc" placeholder="RUC" value={clientInfo.ruc} onChange={handleClientInfoChange} />
                    </div>
                </div>

                <h4>¿Cómo prefiero que me contacten?</h4>
                <div className="contact-method">
                    <button
                        type="button"
                        className={contactMethod === "email" ? "active" : ""}
                        onClick={() => handleContactMethodSelect("email")}
                    >
                        Email
                    </button>
                    <button
                        type="button"
                        className={contactMethod === "whatsapp" ? "active" : ""}
                        onClick={() => handleContactMethodSelect("whatsapp")}
                    >
                        Whatsapp
                    </button>
                    <button
                        type="button"
                        className={contactMethod === "call" ? "active" : ""}
                        onClick={() => handleContactMethodSelect("call")}
                    >
                        Llamada
                    </button>
                </div>

                <div className="observations">
                    <textarea
                        placeholder="Observaciones"
                        value={observations}
                        onChange={(e) => setObservations(e.target.value)}
                    />
                </div>

                <div className="terms">
                    <input
                        type="checkbox"
                        id="terms"
                        checked={termsAccepted}
                        onChange={() => setTermsAccepted(!termsAccepted)}
                    />
                    <label htmlFor="terms">He leído los términos y condiciones</label>
                </div>

                <button type="submit" className="submit-button">
                    Enviar cotización
                </button>
            </form>
        </div>
    );
};

export default QuotePage;