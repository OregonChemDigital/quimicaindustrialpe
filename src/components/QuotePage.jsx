import React, { useState, useEffect } from "react";
import "../styles/QuotePage.css";
import { fetchProducts } from "../services/productService";
import { useWishlist } from "../contexts/WishlistContext"; // Import the Wishlist context
import { logEvent } from "firebase/analytics";
import { analytics } from "../firebase";

const initialClientInfo = {
    name: '',
    lastName: '',
    dni: '',
    phone: '',
    email: '',
    company: '',
    socialReason: '',
    ruc: '',
};

const QuotePage = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [presentations, setPresentations] = useState([]);
    const [clientType, setClientType] = useState('');
    const [clientInfo, setClientInfo] = useState(initialClientInfo);
    const [contactMethod, setContactMethod] = useState('');
    const [observations, setObservations] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [privacyAccepted, setPrivacyAccepted] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const { wishlist } = useWishlist(); // Use the Wishlist context

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const data = await fetchProducts(); // This will now return the formatted array
                setProducts(data);
                setFilteredProducts(data); // Set the filteredProducts to the formatted data

                // Initialize selectedProducts with wishlist items only after products are loaded
                if (wishlist.length > 0) {
                    const initialSelectedProducts = wishlist.map(product => {
                        const matchedProduct = data.find((p) => p.name === product.name);
                        return {
                            name: product.name,
                            volume: '',
                            presentation: '',
                            presentations: matchedProduct?.presentations || [],
                        };
                    });
                    setSelectedProducts(initialSelectedProducts);
                }
            } catch (error) {
                setError('Error al cargar los productos. Por favor, intente nuevamente.');
            }
        };
        loadProducts();
    }, [wishlist]);

    const handleProductSearch = (index, input) => {
        const newProducts = [...selectedProducts];
        newProducts[index].name = input;

        const product = products.find((p) => p.name === input);
        newProducts[index].presentations = product?.presentations || [];
        newProducts[index].presentation = ''; // reset selected presentation
        setSelectedProducts(newProducts);
        
        // Track product search
        logEvent(analytics, 'product_search', {
            search_term: input,
            product_found: !!product
        });
    };

    const handleVolumeChange = (index, volume) => {
        const newProducts = [...selectedProducts];
        newProducts[index].volume = volume;
        setSelectedProducts(newProducts);
        
        // Track volume change
        logEvent(analytics, 'quote_volume_change', {
            product_name: newProducts[index].name,
            volume: volume
        });
    };

    const handleAddProductRow = () => {
        setSelectedProducts([...selectedProducts, { name: '', volume: '', presentation: '', presentations: [] }]);
        
        // Track adding product row
        logEvent(analytics, 'quote_add_product', {
            total_products: selectedProducts.length + 1
        });
    };

    const handleProductSelect = (index, presentationId) => {
        const newProducts = [...selectedProducts];
        newProducts[index].presentation = presentationId;
        setSelectedProducts(newProducts);
        
        // Track presentation selection
        logEvent(analytics, 'quote_select_presentation', {
            product_name: newProducts[index].name,
            presentation_id: presentationId
        });
    };

    const handleRemoveProductRow = (index) => {
        const newProducts = selectedProducts.filter((_, i) => i !== index);
        setSelectedProducts(newProducts);
        
        // Track product removal
        logEvent(analytics, 'quote_remove_product', {
            product_name: selectedProducts[index].name
        });
    };

    const handleClientInfoChange = (e) => {
        const { name, value } = e.target;
        setClientInfo((prev) => ({ ...prev, [name]: value }));
        
        // Track client info changes
        logEvent(analytics, 'quote_update_client', {
            field_name: name
        });
    };

    const handleContactMethodSelect = (method) => {
        setContactMethod(method);
        
        // Track contact method selection
        logEvent(analytics, 'quote_select_contact', {
            method: method
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        logEvent(analytics, 'quote_form_submission', {
            total_products: selectedProducts.length,
            client_type: clientType
        });

        const formData = {
            selectedProducts,
            clientType,
            clientInfo,
            contactMethod,
            observations,
            termsAccepted,
        };

        try {
            const response = await fetch('http://localhost:5001/api/public/quotes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Error al enviar la cotización');
            }

            setSuccess(true);
            setSelectedProducts([]);
            setClientInfo(initialClientInfo);
            setClientType('');
            setContactMethod('');
            setObservations('');
            setTermsAccepted(false);
            setPrivacyAccepted(false);
        } catch (error) {
            setError('Error al enviar la cotización. Por favor, intente nuevamente.');
        }
    };

    return (
        <div className="quote-page">
            <h1 className="page-title">Formulario de Cotización</h1>

            <form className="quote-form" onSubmit={handleSubmit}>
                <section className="product-section">
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
                                    {product.presentations?.map((presentation) => (
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
                                className="remove-btn"
                                onClick={() => handleRemoveProductRow(index)}
                            >
                                X
                            </button>
                        </div>
                    ))}
                    <button type="button" className="add-btn" onClick={handleAddProductRow}>
                        Agregar Más Productos
                    </button>
                </section>

                <section className="client-section">
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
                </section>
                <section className="contact-method">
                    <h4>¿Cómo prefiero que me contacten?</h4>

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
                </section>

                <section className="observations">
                    <textarea
                        placeholder="Observaciones"
                        value={observations}
                        onChange={(e) => setObservations(e.target.value)}
                    />
                </section>

                <section className="terms-privacy">
                    <input
                        type="checkbox"
                        id="terms"
                        checked={termsAccepted}
                        onChange={() => setTermsAccepted(!termsAccepted)}
                    />
                    <label htmlFor="terms">He leído los términos y condiciones</label>
                    <input
                        type="checkbox"
                        id="privacy"
                        checked={privacyAccepted}
                        onChange={() => setPrivacyAccepted(!privacyAccepted)}
                    />
                    <label htmlFor="terms">Acepto la politica de privacidad</label>
                </section>

                <section className="submit-quote">
                    <button type="submit" className="submit-btn" disabled={!termsAccepted || !privacyAccepted}>
                        Enviar cotización
                    </button>
                </section>
            </form>
        </div>
    );
};

export default QuotePage;
