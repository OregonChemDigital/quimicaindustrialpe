import React, { useState } from 'react';
import { trackQuoteFormSubmission } from '../utils/analytics';
import '../styles/QuoteForm.css';

const QuoteForm = ({ source = 'unknown' }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    products: []
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Track the form submission with the source
      trackQuoteFormSubmission(source);
      
      // Your form submission logic here
      console.log('Form submitted:', formData);
      
      // Reset form or show success message
    } catch (error) {
      console.error('Error submitting form:', error);
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
        />
      </div>
      
      <button type="submit" className="submit-button">
        Enviar Cotización
      </button>
    </form>
  );
};

export default QuoteForm; 