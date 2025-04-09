export const fetchProducts = async () => {
    try {
        // Fetch products
        const productsResponse = await fetch("http://localhost:5001/api/public/productos");
        const productsData = await productsResponse.json();
        const productsArray = productsData.data;

        // Fetch presentations
        const presentationsResponse = await fetch("http://localhost:5001/api/public/presentaciones");
        const presentationsData = await presentationsResponse.json();
        const presentationsArray = presentationsData.data;

        if (Array.isArray(productsArray)) {
            const formattedProducts = productsArray.map((product) => {
                // Find the full presentation data for each product's presentations
                const enrichedPresentations = (product.presentations || []).map(presentation => {
                    const fullPresentation = presentationsArray.find(p => p._id === presentation._id);
                    return {
                        name: presentation.name,
                        measure: presentation.measure,
                        type: presentation.type,
                        image: fullPresentation?.images?.site1 || ''
                    };
                });

                return {
                    _id: product._id,
                    name: product.name,
                    presentations: enrichedPresentations,
                    categories: product.categories || [],
                    image: product.images?.site1 || '',
                    description: product.descriptions?.site1 || '',
                    use: product.uses?.site1 || '',
                    slug: product.name.toLowerCase().replace(/\s+/g, '-')
                };
            });
            return formattedProducts;
        } else {
            throw new Error("Fetched data is not an array");
        }
    } catch (error) {
        console.error('Error in fetchProducts:', error);
        throw new Error(`Error fetching products: ${error.message}`);
    }
};


