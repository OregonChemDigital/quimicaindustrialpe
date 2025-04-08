export const fetchProducts = async () => {
    try {
        const response = await fetch("http://localhost:5001/api/public/productos");
        const data = await response.json();

        const productsArray = data.data;

        if (Array.isArray(productsArray)) {
            const formattedProducts = productsArray.map((product) => ({
                _id: product._id,
                name: product.name,
                presentations: product.presentations,
                categories: product.categories,
                image: product.images.site1,
                description: product.descriptions.site1,
                use: product.uses.site1,
            }));

            return formattedProducts;
        } else {
            throw new Error("Fetched data is not an array");
        }
    } catch (error) {
        throw new Error(`Error fetching products: ${error.message}`);
    }
};


