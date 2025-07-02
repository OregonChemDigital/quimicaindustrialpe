import { API_ENDPOINTS } from '../config/api';

// Cache for storing fetched data
let dataCache = {
    products: null,
    categories: null,
    presentations: null,
    banners: null,
    lastFetch: null
};

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

const isCacheValid = () => {
    return dataCache.lastFetch && (Date.now() - dataCache.lastFetch) < CACHE_DURATION;
};

const fetchAllData = async () => {
    if (isCacheValid()) {
        return dataCache;
    }

    try {
        // Make parallel requests for all data
        const [productsResponse, categoriesResponse, presentationsResponse, bannersResponse] = await Promise.all([
            fetch(API_ENDPOINTS.PRODUCTS),
            fetch(API_ENDPOINTS.CATEGORIES),
            fetch(API_ENDPOINTS.PRESENTATIONS),
            fetch(`${API_ENDPOINTS.BANNERS}?site=site1`)
        ]);

        // Check all responses
        if (!productsResponse.ok || !categoriesResponse.ok || !presentationsResponse.ok || !bannersResponse.ok) {
            throw new Error('Error fetching data from one or more endpoints');
        }

        // Parse all responses
        const [productsData, categoriesData, presentationsData, bannersData] = await Promise.all([
            productsResponse.json(),
            categoriesResponse.json(),
            presentationsResponse.json(),
            bannersResponse.json()
        ]);

        // Update cache
        dataCache = {
            products: productsData.data || [],
            categories: categoriesData.data || [],
            presentations: presentationsData.data || [],
            banners: bannersData.data || [],
            lastFetch: Date.now()
        };

        return dataCache;
    } catch (error) {
        console.error('Error fetching all data:', error);
        throw new Error(`Error al cargar los datos: ${error.message}`);
    }
};

export const fetchProducts = async () => {
    try {
        const { products, categories, presentations } = await fetchAllData();

        return products.map(product => ({
            _id: product._id,
            name: product.name,
            presentations: (product.presentations || []).map(presentation => {
                const fullPresentation = presentations.find(p => p._id === presentation._id);
                return {
                    _id: presentation._id,
                    name: presentation.name,
                    measure: presentation.measure,
                    type: presentation.type,
                    image: fullPresentation?.images?.site1 || ''
                };
            }),
            categories: (product.categories || []).map(category => {
                const fullCategory = categories.find(c => c._id === category._id);
                return {
                    _id: category._id,
                    name: category.name,
                    image: fullCategory?.images?.site1 || ''
                };
            }),
            image: product.images?.site1 || '',
            description: product.descriptions?.site1 || '',
            use: product.uses?.site1 || '',
            price: product.prices?.site1 || null,
            slug: product.name.toLowerCase().replace(/\s+/g, '-'),
            createdAt: product.createdAt
        }));
    } catch (error) {
        console.error('Error fetching products:', error);
        throw new Error(`Error al cargar los productos: ${error.message}`);
    }
};

export const fetchProductBySlug = async (slug) => {
    try {
        const { products, categories, presentations } = await fetchAllData();
        
        const product = products.find(p => p.name.toLowerCase().replace(/\s+/g, '-') === slug);
        if (!product) {
            throw new Error('Producto no encontrado');
        }

        return {
            _id: product._id,
            name: product.name,
            presentations: (product.presentations || []).map(presentation => {
                const fullPresentation = presentations.find(p => p._id === presentation._id);
                return {
                    _id: presentation._id,
                    name: presentation.name,
                    measure: presentation.measure,
                    type: presentation.type,
                    image: fullPresentation?.images?.site1 || ''
                };
            }),
            categories: (product.categories || []).map(category => {
                const fullCategory = categories.find(c => c._id === category._id);
                return {
                    _id: category._id,
                    name: category.name,
                    image: fullCategory?.images?.site1 || ''
                };
            }),
            image: product.images?.site1 || '',
            description: product.descriptions?.site1 || '',
            use: product.uses?.site1 || '',
            price: product.prices?.site1 || null,
            slug: product.name.toLowerCase().replace(/\s+/g, '-'),
            createdAt: product.createdAt
        };
    } catch (error) {
        console.error('Error fetching product:', error);
        throw new Error(`Error al cargar el producto: ${error.message}`);
    }
};

export const fetchCategories = async () => {
    try {
        const { categories } = await fetchAllData();
        return categories.map(category => ({
            _id: category._id,
            name: category.name,
            image: category.images?.site1 || '',
            description: category.descriptions?.site1 || ''
        }));
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw new Error(`Error al cargar las categorías: ${error.message}`);
    }
};

export const fetchPresentations = async () => {
    try {
        const { presentations } = await fetchAllData();
        return presentations.map(presentation => ({
            _id: presentation._id,
            name: presentation.name,
            measure: presentation.measure,
            type: presentation.type,
            image: presentation.images?.site1 || ''
        }));
    } catch (error) {
        console.error('Error fetching presentations:', error);
        throw new Error(`Error al cargar las presentaciones: ${error.message}`);
    }
};

export const fetchBanners = async () => {
    try {
        const { banners } = await fetchAllData();
        return banners.map(banner => ({
            _id: banner._id,
            title: banner.title,
            description: banner.description,
            image: banner.images?.site1 || '',
            link: banner.link || '',
            order: banner.order || 0
        }));
    } catch (error) {
        console.error('Error fetching banners:', error);
        throw new Error(`Error al cargar los banners: ${error.message}`);
    }
};


