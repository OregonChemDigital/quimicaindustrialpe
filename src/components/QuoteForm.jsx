import React, { useState } from 'react';
import { trackQuoteFormSubmission } from '../utils/analytics';
import LoadingSpinner from './LoadingSpinner';
import SuccessMessage from './SuccessMessage';
import '../styles/QuoteForm.css';

const QuoteForm = ({ source = 'unknown' }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    products: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Track the form submission with the source
      trackQuoteFormSubmission(source);
      
      const requestData = {
        clientInfo: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        },
        observations: formData.message,
        selectedProducts: formData.products,
        site: {
          id: 'quimicaindustrialpe',
          name: 'Química Industrial Perú',
          url: window.location.origin
        }
      };
      
      console.log('Sending request to backend:', requestData);
      
      const response = await fetch('http://localhost:5001/api/public/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.message || 'Error al enviar la cotización');
      }

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        products: []
      });
      
      // Show success message
      setShowSuccess(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      setError(error.message || 'Error al enviar la cotización. Por favor, intente nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="quote-form">
        <div className="form-group">
          <label htmlFor="name">Nombre</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="phone">Teléfono</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="message">Mensaje</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </div>
        
        <button 
          type="submit" 
          className="submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <LoadingSpinner size="small" />
          ) : (
            'Enviar Cotización'
          )}
        </button>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
      </form>

      {showSuccess && (
        <SuccessMessage
          message="¡Gracias por tu interés! Hemos recibido tu solicitud de cotización y nos pondremos en contacto contigo pronto."
          onClose={() => setShowSuccess(false)}
          duration={5000}
        />
      )}
    </>
  );
};

export default QuoteForm; 