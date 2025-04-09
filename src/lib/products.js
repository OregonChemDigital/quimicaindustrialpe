// This is a placeholder for your actual product data
// Replace this with your real product data source (API, database, etc.)
const products = [
    {
        slug: 'producto-ejemplo',
        name: 'Producto Ejemplo',
        description: 'Descripción detallada del producto',
        image: '/images/products/example.jpg',
        presentations: [
            { name: 'Presentación 1', measure: '1L' },
            { name: 'Presentación 2', measure: '5L' }
        ],
        categories: ['Categoría 1', 'Categoría 2'],
        use: 'Usos específicos del producto'
    }
    // Add more products here
];

export function getAllProducts() {
    return products;
}

export function getProductBySlug(slug) {
    return products.find(product => product.slug === slug);
}

export function getProductsByCategory(category) {
    return products.filter(product => 
        product.categories.includes(category)
    );
} 