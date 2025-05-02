const API_URL = process.env.NODE_ENV === 'production' 
    ? 'https://oregonchem-backend.onrender.com' 
    : 'http://localhost:5001';

export const API_ENDPOINTS = {
    BANNERS: `${API_URL}/api/public/banners`,
    CATEGORIES: `${API_URL}/api/public/categorias`,
    PRODUCTS: `${API_URL}/api/public/productos`,
    PRESENTATIONS: `${API_URL}/api/public/presentaciones`,
    QUOTES: `${API_URL}/api/public/quotes`
}; 