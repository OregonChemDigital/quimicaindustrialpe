import React, { useState, useEffect } from "react";
import "../styles/QuotePage.css";
import { fetchProducts } from "../services/productService";
import { useWishlist } from "../contexts/WishlistContext"; // Import the Wishlist context
import { logEvent } from "firebase/analytics";
import { analytics } from "../firebase";
import LoadingSpinner from './LoadingSpinner';
import SuccessMessage from './SuccessMessage';

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
    const [clientType, setClientType] = useState('Persona Natural');
    const [clientInfo, setClientInfo] = useState(initialClientInfo);
    const [contactMethod, setContactMethod] = useState('');
    const [observations, setObservations] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [privacyAccepted, setPrivacyAccepted] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const handleFrequencyChange = (index, frequency) => {
        const newProducts = [...selectedProducts];
        newProducts[index].frequency = frequency;
        setSelectedProducts(newProducts);
        
        // Track frequency change
        logEvent(analytics, 'quote_update_frequency', {
            product_name: newProducts[index].name,
            frequency: frequency
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        setIsSubmitting(true);

        try {
            // Validate required fields
            if (!clientInfo.name?.trim()) {
                throw new Error('El nombre es requerido');
            }
            if (!clientInfo.phone?.trim()) {
                throw new Error('El teléfono es requerido');
            }
            if (!clientInfo.email?.trim()) {
                throw new Error('El email es requerido');
            }
            if (selectedProducts.length === 0) {
                throw new Error('Debe seleccionar al menos un producto');
            }

            const formData = {
                products: selectedProducts.map(product => {
                    const presentation = product.presentations.find(p => p._id === product.presentation);
                    return {
                        id: presentation ? presentation.name : '-',
                        name: product.name,
                        quantity: parseFloat(product.volume) || 1,
                        unit: (parseFloat(product.volume) || 1) > 1 ? 'unidades' : 'unidad',
                        presentation: presentation ? presentation.name : '-',
                        frequency: product.frequency || 'única'
                    };
                }),
                client: {
                    name: clientInfo.name.trim(),
                    email: clientInfo.email.trim(),
                    phone: clientInfo.phone.trim().replace(/\D/g, ''),
                    company: clientInfo.socialReason?.trim() || '',
                    ruc: clientInfo.ruc?.trim() || ''
                },
                observations: observations.trim(),
                contactMethod: contactMethod,
                status: 'pending',
                site: {
                    name: 'Química Industrial Perú',
                    address: 'Av. Industrial 123, Lima, Perú',
                    district: 'Lima',
                    city: 'Lima',
                    department: 'Lima'
                }
            };

            // Log the formatted data being sent to the server
            console.log('Formatted data being sent:', formData);
            console.log('Client info being sent:', formData.client);

            const response = await fetch('http://localhost:5001/api/public/quotes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error response:', errorData);
                throw new Error(errorData.message || 'Error al procesar la cotización');
            }

            setSuccess(true);
            setSelectedProducts([]);
            setClientInfo(initialClientInfo);
            setClientType('Persona Natural');
            setContactMethod('');
            setObservations('');
            setTermsAccepted(false);
            setPrivacyAccepted(false);
        } catch (error) {
            console.error('Error submitting quote:', error);
            setError(error.message || 'Error al procesar la cotización. Por favor, intente nuevamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="quote-page">
            <h1 className="page-title">Formulario de Cotización</h1>

            {success && (
                <SuccessMessage
                    message="¡Gracias por tu interés! Hemos recibido tu solicitud de cotización y nos pondremos en contacto contigo pronto."
                    onClose={() => setSuccess(false)}
                    duration={5000}
                />
            )}

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
                                <select
                                    onChange={(e) => handleFrequencyChange(index, e.target.value)}
                                    value={product.frequency || 'única compra'}
                                >
                                    <option value="única compra">Única Compra</option>
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
                            <option value="Persona Natural">Persona Natural</option>
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
                        className={contactMethod === "llamada" ? "active" : ""}
                        onClick={() => handleContactMethodSelect("llamada")}
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
                    <button 
                        type="submit" 
                        className="submit-btn" 
                        disabled={isSubmitting || !termsAccepted || !privacyAccepted}
                    >
                        {isSubmitting ? (
                            <LoadingSpinner size="small" />
                        ) : (
                            'Enviar cotización'
                        )}
                    </button>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}
                </section>
            </form>
        </div>
    );
};

export default QuotePage;
