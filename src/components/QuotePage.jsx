import React, { useState, useEffect } from "react";
import "../styles/QuotePage.css";
import { fetchProducts } from "../services/productService";
import { useWishlist } from "../contexts/WishlistContext"; // Import the Wishlist context
import { safeLogEvent } from "../utils/analytics";
import LoadingSpinner from './LoadingSpinner';
import SuccessMessage from './SuccessMessage';
import { API_ENDPOINTS } from '../config/api';

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
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});

    const { wishlist, clearWishlist } = useWishlist(); // Use the Wishlist context

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
        safeLogEvent('product_search', {
            search_term: input,
            product_found: !!product
        });
    };

    const handleVolumeChange = (index, volume) => {
        // If the input is empty, allow it
        if (volume === '') {
            const newProducts = [...selectedProducts];
            newProducts[index].volume = '';
            setSelectedProducts(newProducts);
            return;
        }

        // Convert to number and ensure it's positive
        const numericValue = parseFloat(volume);
        
        // If it's a valid number and not negative, update the state
        if (!isNaN(numericValue) && numericValue >= 0) {
            const newProducts = [...selectedProducts];
            newProducts[index].volume = volume; // Keep the string input for display
            setSelectedProducts(newProducts);
            
            // Track volume change with numeric value
            safeLogEvent('quote_volume_change', {
                product_name: newProducts[index].name,
                volume: numericValue
            });
        }
    };

    const handleAddProductRow = () => {
        setSelectedProducts([...selectedProducts, { name: '', volume: '', presentation: '', presentations: [] }]);
        
        // Track adding product row
        safeLogEvent('quote_add_product', {
            total_products: selectedProducts.length + 1
        });
    };

    const handleProductSelect = (index, presentationId) => {
        const newProducts = [...selectedProducts];
        newProducts[index].presentation = presentationId;
        setSelectedProducts(newProducts);
        
        // Track presentation selection
        safeLogEvent('quote_select_presentation', {
            product_name: newProducts[index].name,
            presentation_id: presentationId
        });
    };

    const handleRemoveProductRow = (index) => {
        const newProducts = selectedProducts.filter((_, i) => i !== index);
        setSelectedProducts(newProducts);
        
        // Track product removal
        safeLogEvent('quote_remove_product', {
            product_name: selectedProducts[index].name
        });
    };

    const handleClientInfoChange = (e) => {
        const { name, value } = e.target;
        setClientInfo(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear validation error when user types
        if (validationErrors[name]) {
            setValidationErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
        
        // Track client info changes
        safeLogEvent('quote_update_client', {
            field_name: name
        });
    };

    const handleContactMethodSelect = (method) => {
        setContactMethod(method);
        
        // Track contact method selection
        safeLogEvent('quote_select_contact', {
            method: method
        });
    };

    const handleFrequencyChange = (index, frequency) => {
        const newProducts = [...selectedProducts];
        newProducts[index].frequency = frequency;
        setSelectedProducts(newProducts);
        
        // Track frequency change
        safeLogEvent('quote_update_frequency', {
            product_name: newProducts[index].name,
            frequency: frequency
        });
    };

    const validateForm = () => {
        const errors = {};
        
        // Required fields for all client types
        if (!clientInfo.name?.trim()) errors.name = '*campo obligatorio';
        if (!clientInfo.lastName?.trim()) errors.lastName = '*campo obligatorio';
        if (!clientInfo.dni?.trim()) errors.dni = '*campo obligatorio';
        if (!clientInfo.phone?.trim()) errors.phone = '*campo obligatorio';
        if (!clientInfo.email?.trim()) errors.email = '*campo obligatorio';

        // Additional required fields for company types
        if (clientType === 'empresa' || clientType === 'personaEmpresa') {
            if (!clientInfo.socialReason?.trim()) errors.socialReason = '*campo obligatorio';
            if (!clientInfo.ruc?.trim()) errors.ruc = '*campo obligatorio';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        
        if (!validateForm()) {
            return;
        }

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
            if (!contactMethod) {
                throw new Error('Debe seleccionar un método de contacto');
            }

            const formData = {
                products: selectedProducts.map(product => {
                    const presentation = product.presentations?.find(p => p._id === product.presentation);
                    return {
                        id: product.name,
                        name: product.name,
                        quantity: parseFloat(product.volume) || 1,
                        unit: (parseFloat(product.volume) || 1) > 1 ? 'unidades' : 'unidad',
                        presentation: presentation?.name || product.name,
                        frequency: product.frequency || 'única'
                    };
                }),
                client: {
                    name: clientInfo.name.trim(),
                    lastname: clientInfo.lastName.trim(),
                    email: clientInfo.email.trim(),
                    phone: clientInfo.phone.trim().replace(/\D/g, ''),
                    company: clientInfo.socialReason?.trim() || '',
                    ruc: clientInfo.ruc?.trim() || ''
                },
                observations: observations.trim(),
                contactMethod: contactMethod,
                status: 'pending',
                site: {
                    id: 'quimicaindustrialpe',
                    name: 'Química Industrial Perú',
                    address: 'Av. Industrial 123, Lima, Perú',
                    district: 'Lima',
                    city: 'Lima',
                    department: 'Lima',
                    phone: '+51 1 123 4567',
                    email: 'contacto@quimicaindustrialpe.com'
                }
            };

            const response = await fetch(API_ENDPOINTS.QUOTES, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error response:', errorData);
                throw new Error(errorData.message || 'Error al procesar la cotización');
            }

            // Clear the wishlist after successful submission
            clearWishlist();
            
            setSuccess(true);
            setSelectedProducts([]);
            setClientInfo(initialClientInfo);
            setClientType('Persona Natural');
            setContactMethod('');
            setObservations('');
            setTermsAccepted(false);
            setPrivacyAccepted(false);

            // Track successful submission
            safeLogEvent('quote_submitted', {
                success: true,
                products_count: formData.products.length
            });
        } catch (error) {
            console.error('Error submitting quote:', error);
            setError(error.message);
            
            // Track failed submission
            safeLogEvent('quote_submitted', {
                success: false,
                error: error.message
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const termsAndConditions = `CONDICIONES GENERALES:
Validez de la oferta: 3 días hábiles / Sujeto a disponibilidad de stock
Forma de pago: Contado
El tiempo de entrega es de 24 a 48 horas, previa coordinación, luego confirmado el pago correspondiente.
Los retiros de mercadería en nuestro almacén de Surquillo son previa coordinación con el/la ejecutivo de ventas.
Los despachos gratis se realizan por compras mayores a $600 dentro de Lima Metropolitano, según coordinación con el área de despachos.
Delivery por compras menores a $600 tienen un costo adicional según la dirección de entrega.
Los envíos a provincia tienen un monto adicional por embalaje y envío hasta la agencia de transporte. El flete del transporte Lima-Provincia corre por cuenta del cliente (Pago Destino). Los daños asociados a la carga debido a mal manipuleo en transporte son por cuenta del cliente que requiere del flete.
Una vez entregada la mercadería no se hacen cambios ni devoluciones.
Los Términos y condiciones contenidos en el documento adjunto forman parte de la presente cotización, que rige la oferta de el/los producto(s) a ser vendido(s) y/o despachados por Oregon Chem Group S.A.C. a favor del cliente.

El Cliente al aceptar la Oferta mediante la confirmación de la compra, está aceptando, además, todos los T&C del documento adjunto.

TÉRMINOS Y CONDICIONES:
EL CLIENTE debe leer, entender y aceptar todas las condiciones establecidas en los Términos y condiciones, así como en los demás documentos incorporados a los mismos por referencia, para la compra y/o despacho de el/los productos(s).
VALIDEZ DE LA OFERTA: 3 días hábiles o sujeto a disponibilidad de stock
FORMA DE PAGO: Contado.
TIEMPO DE ENTREGA: De 24 a 48 horas. Previa coordinación, luego de recibida la Orden de Compra y confirmado el pago correspondiente. Sujeto a disponibilidad de stock, ubicación/dirección del cliente, el tipo de embalaje ofrecido o solicitado y el transporte entre nuestros almacenes. Puede variar el tiempo dependiendo de las caracteristicas de la orden: peso total o parcial, volumen total o parcial y caracteristicas físicas.
La presente cotización no separa la mercadería.
FICHA TÉCNICA: EL CLIENTE ha analizado, conoce y acepta que los componentes de el/los productos(s) y sus características son las detalladas en la FICHA TECNICA que ha recibido junta o previa o posteriormente a la COTIZACIÓN.
CARACTERÍSTICAS DEL PRODUCTO: EL CLIENTE reconoce y acepta que, por sus características, el nivel de concentración y otros parámetros de el/los productos(s) está sujeto a degradación por factores como el transcurso del tiempo, temperatura, manipulación, entre otros, y que Oregon Chem Group no asume, ni asumirá responsabilidad por los efectos de lo anterior. EL CLIENTE debe hacer sus propias investigaciones o pruebas sobre el producto para determinar la aplicabilidad de el/los productos(s), según sus propósitos particulares.
El empaque original del producto podrá ser modificado, reparado o cambiado en su totalidad por los siguientes motivos:
Incrementar la seguridad en el transporte, tanto la del producto como la de las personas involucradas en su manipulación.
Deterioro del empaque original durante la importación, almacenaje o manipulación.
Fraccionamiento y/o modificación en el volumen/peso original del producto.
ENTREGA DEL PRODUCTO (LIMA METROPOLITANA):
RETIRO EN TIENDA: Recojo en nuestra dirección o a la indicada por el ejecutivo comercial, previa coordinación
DESPACHO GRATUITO: Por compras mayores a USD 600.00 (seis cientos y 00/100 USD) dentro de Lima Metropolitana, sujeto a programación.
DELIVERY: Compras menores a USD 600.00 (seis cientos y 00/100 USD), son sujetas a un costo adicional según la dirección de entrega. Previa coordinacion y pago del mismo.
ENTREGA DEL PRODUCTO (PROVINCIA):
ENVÍOS A PROVINCIA: Costo adicional por embalaje y envío hasta la agencia de transporte. Esta podrá ser seleccionada por el cliente entre las empresas homologadas. (1)Ver lista de agencias homologadas.
PAGO DESTINO: El costo de transporte Lima – Provincia corre por cuenta del cliente. La responsabilidad de Oregon Chem Group termina una vez entregada la orden en la agencia de transporte de seleccionada por EL CLIENTE.
Daños asociados a la carga debido a mal manipuleo en transporte seleccionado son por cuenta y riesgo de EL CLIENTE.
Indicar los siguientes datos: Nombre de la Agencia de transporte, indicar si es envío a domicilio o recojo en oficina de la agencia; además: NOMBRE / DNI / CELULAR de la persona que recibe o retira el producto.
Oregon Chem Group no asume responsabilidad alguna por los riesgos y costos asociados a el/los productos(s) desde el momento de su entrega en el lugar indicado en la COTIZACIÓN. Mediante este acto, EL CLIENTE libera de antemano a Oregon Chem Group de toda responsabilidad en caso de cualquier tipo de demanda y/o reclamo de terceros. EL CLIENTE indemnizará y resarcirá a Oregon Chem en caso éste fuese obligado a responder ante terceros por los daños y perjuicios.
CONFORMIDAD DEL PRODUCTO: A la recepción del producto(s) por parte de EL CLIENTE y antes de usarlos, deberá examinarlos cuidadosamente para comprobar que cumplen lo estipulado en la COTIZACIÓN. Una vez entregada la mercadería no se hacen cambios ni devoluciones.
Toda solicitud de cambio, devolución u observación sobre el producto deberá enviarse a Oregon Chem Group por escrito y con el debido sustento dentro de los siete (7) días de recibido el/los productos(s). De encontrar conforme las observaciones planteadas por EL CLIENTE, Oregon Chem Group procederá a negociar con el Proveedor de el/los productos(s), y en su caso, podrá negociar un descuento o sustituir el/los productos(s) por otro(s) de iguales características. Transcurrido el plazo referido sin que EL CLIENTE haya comunicado observaciones, Oregon Chem quedará automáticamente exonerado de cualquier obligación y responsabilidad, dentro de lo permitido por ley. Bajo ningún supuesto Oregon Chem Group asumirá responsabilidad frente a EL CLIENTE y/o terceros por la calidad o idoneidad de el/los productos(s) si, luego del despacho éste fuera mezclado con otros insumos en cualquier proceso productivo. En cualquier escenario la responsabilidad frente EL CLIENTE por cualquier reclamo estará limitada a los daños directos y bajo ninguna circunstancia excederá el valor de venta (excluido el IGV) del lote comprobadamente defectuoso de el/los productos(s) adquirido.`;

    const privacyPolicy = `Política de Privacidad
[Nombre de la Empresa], en calidad de responsable del tratamiento de datos personales, pone a disposición de sus usuarios y clientes la presente Política de Privacidad, en cumplimiento de lo establecido en la Ley N.º 29733 – Ley de Protección de Datos Personales y su reglamento aprobado mediante Decreto Supremo N.º 003-2013-JUS.

Nos comprometemos a garantizar la privacidad y protección de los datos personales que recopilamos en el ejercicio de nuestras actividades comerciales, especialmente en la distribución de productos químicos.

1. Identificación del Responsable del Tratamiento
Razón social: [Nombre completo de la empresa]
RUC: [Número de RUC]
Domicilio: [Dirección fiscal o comercial]
Correo electrónico de contacto: [ejemplo@empresa.com]
Teléfono: [Número de teléfono]

2. Datos Personales Recopilados
Recopilamos los siguientes datos personales de manera directa o a través de formularios en nuestro sitio web:

Nombre completo

Documento de identidad (DNI, CE, RUC, etc.)

Dirección de correo electrónico

Número de teléfono

Dirección física

Información de empresa (razón social, RUC, dirección)

Información para fines de facturación y/o envío de productos

3. Finalidad del Tratamiento
Los datos personales serán utilizados para los siguientes fines:

Atender consultas y solicitudes de información

Gestionar cotizaciones, ventas y entregas de productos químicos

Realizar gestiones administrativas, contables y fiscales

Cumplir con obligaciones legales, regulatorias y contractuales

Enviar comunicaciones comerciales relacionadas con nuestros productos y servicios, siempre que haya sido autorizado

Evaluar la calidad del servicio y realizar encuestas de satisfacción

4. Consentimiento del Titular
El tratamiento de datos personales se realiza con el consentimiento libre, previo, expreso e informado del titular de los datos. Al proporcionar sus datos a través de formularios físicos o digitales, el titular acepta expresamente esta Política de Privacidad.

5. Almacenamiento y Plazo de Conservación
Los datos serán almacenados en bancos de datos personales de titularidad de [Nombre de la Empresa] y se conservarán durante el tiempo necesario para cumplir con las finalidades descritas, o mientras exista una relación comercial o contractual, o según lo exijan disposiciones legales aplicables.

6. Transferencia de Datos
No se transferirán los datos personales a terceros sin el consentimiento previo del titular, salvo en los casos permitidos por la Ley, o cuando sea necesario para el cumplimiento de obligaciones contractuales (por ejemplo, servicios logísticos, facturación electrónica).

7. Derechos del Titular de Datos
El titular de los datos puede ejercer en cualquier momento sus derechos de:

Acceso

Rectificación

Cancelación

Oposición

Revocación de consentimiento

Para ejercer estos derechos, puede enviar una solicitud al correo electrónico [correo@empresa.com], indicando su nombre completo, número de documento y el derecho que desea ejercer. La solicitud será atendida en los plazos previstos por ley.

8. Medidas de Seguridad
[Nombre de la Empresa] adopta medidas técnicas, organizativas y legales para proteger los datos personales contra el acceso no autorizado, pérdida, alteración o destrucción. Se aplican protocolos adecuados conforme a la naturaleza de los datos tratados.

9. Uso de Cookies
Este sitio web puede utilizar cookies para mejorar la experiencia del usuario. Puede revisar nuestra [Política de Cookies] para más información y gestionar sus preferencias.

10. Modificaciones a la Política de Privacidad
Nos reservamos el derecho de modificar esta Política de Privacidad en cualquier momento. Las modificaciones serán publicadas en nuestro sitio web y entrarán en vigencia desde su publicación.

11. Contacto
Para cualquier consulta relacionada con esta Política de Privacidad, puede escribirnos a:
[correo@empresa.com]
[Teléfono]
Dirección: [Dirección física]`;

    return (
        <div className={`quote-page ${isSubmitting ? 'dimmed' : ''}`}>
            <h1 className="page-title">Formulario de Cotización</h1>

            {isSubmitting && (
                <div className="loading-overlay">
                    <LoadingSpinner size="medium" />
                    <p>Enviando cotización...</p>
                </div>
            )}

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
                                    min="0"
                                    step="1"
                                    onKeyDown={(e) => {
                                        // Prevent minus sign from being typed
                                        if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                                            e.preventDefault();
                                        }
                                    }}
                                />
                                <select
                                    onChange={(e) => handleFrequencyChange(index, e.target.value)}
                                    value={product.frequency || 'única'}
                                >
                                    <option value="única">Única Compra</option>
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
                        <select 
                            value={clientType} 
                            onChange={(e) => setClientType(e.target.value)}
                            className={validationErrors.clientType ? 'error' : ''}
                        >
                            <option value="Persona Natural">Persona Natural</option>
                            <option value="empresa">Empresa</option>
                            <option value="personaEmpresa">Persona con Empresa</option>
                        </select>
                        {validationErrors.clientType && (
                            <span className="error-message">{validationErrors.clientType}</span>
                        )}
                    </div>
                    <div className="client-info">
                        <input 
                            type="text" 
                            name="name" 
                            placeholder="Nombre" 
                            value={clientInfo.name} 
                            onChange={handleClientInfoChange}
                            className={validationErrors.name ? 'error' : ''}
                        />
                        {validationErrors.name && (
                            <span className="error-message">{validationErrors.name}</span>
                        )}
                        <input 
                            type="text" 
                            name="lastName" 
                            placeholder="Apellidos" 
                            value={clientInfo.lastName} 
                            onChange={handleClientInfoChange}
                            className={validationErrors.lastName ? 'error' : ''}
                        />
                        {validationErrors.lastName && (
                            <span className="error-message">{validationErrors.lastName}</span>
                        )}
                        <input 
                            type="text" 
                            name="dni" 
                            placeholder="DNI" 
                            value={clientInfo.dni} 
                            onChange={handleClientInfoChange}
                            className={validationErrors.dni ? 'error' : ''}
                        />
                        {validationErrors.dni && (
                            <span className="error-message">{validationErrors.dni}</span>
                        )}
                        <input 
                            type="text" 
                            name="phone" 
                            placeholder="Celular" 
                            value={clientInfo.phone} 
                            onChange={handleClientInfoChange}
                            className={validationErrors.phone ? 'error' : ''}
                        />
                        {validationErrors.phone && (
                            <span className="error-message">{validationErrors.phone}</span>
                        )}
                        <input 
                            type="email" 
                            name="email" 
                            placeholder="Email" 
                            value={clientInfo.email} 
                            onChange={handleClientInfoChange}
                            className={validationErrors.email ? 'error' : ''}
                        />
                        {validationErrors.email && (
                            <span className="error-message">{validationErrors.email}</span>
                        )}
                        
                        {(clientType === 'empresa' || clientType === 'personaEmpresa') && (
                            <>
                                <h4 className="company-info-header">Información de la Empresa</h4>
                                <input 
                                    type="text" 
                                    name="socialReason" 
                                    placeholder="Razón Social" 
                                    value={clientInfo.socialReason} 
                                    onChange={handleClientInfoChange}
                                    className={validationErrors.socialReason ? 'error' : ''}
                                />
                                {validationErrors.socialReason && (
                                    <span className="error-message">{validationErrors.socialReason}</span>
                                )}
                                <input 
                                    type="text" 
                                    name="ruc" 
                                    placeholder="RUC" 
                                    value={clientInfo.ruc} 
                                    onChange={handleClientInfoChange}
                                    className={validationErrors.ruc ? 'error' : ''}
                                />
                                {validationErrors.ruc && (
                                    <span className="error-message">{validationErrors.ruc}</span>
                                )}
                            </>
                        )}
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
                    <div className="terms-container">
                        <input
                            type="checkbox"
                            id="terms"
                            checked={termsAccepted}
                            onChange={() => setTermsAccepted(!termsAccepted)}
                        />
                        <label htmlFor="terms">
                            He leído los <span className="terms-link" onClick={() => setShowTermsModal(true)}>términos y condiciones</span>
                        </label>
                    </div>
                    <div className="privacy-container">
                        <input
                            type="checkbox"
                            id="privacy"
                            checked={privacyAccepted}
                            onChange={() => setPrivacyAccepted(!privacyAccepted)}
                        />
                        <label htmlFor="privacy">
                            Acepto la <span className="terms-link" onClick={() => setShowPrivacyModal(true)}>política de privacidad</span>
                        </label>
                    </div>
                </section>

                {showTermsModal && (
                    <div className="modal-overlay" onClick={() => setShowTermsModal(false)}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Términos y Condiciones</h2>
                                <button className="close-button" onClick={() => setShowTermsModal(false)}>X</button>
                            </div>
                            <div className="modal-body">
                                <pre>{termsAndConditions}</pre>
                            </div>
                        </div>
                    </div>
                )}

                {showPrivacyModal && (
                    <div className="modal-overlay" onClick={() => setShowPrivacyModal(false)}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Política de Privacidad</h2>
                                <button className="close-button" onClick={() => setShowPrivacyModal(false)}>X</button>
                            </div>
                            <div className="modal-body">
                                <pre>{privacyPolicy}</pre>
                            </div>
                        </div>
                    </div>
                )}

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