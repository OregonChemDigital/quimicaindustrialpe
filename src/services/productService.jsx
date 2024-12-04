export const fetchProducts = async () => {
    try {
        const response = await fetch("https://oregonchem-backend.onrender.com/api/public/productos");
        const data = await response.json();
        console.log("Fetched data structure:", data);

        // Check if the fetched data is an array and handle the structure accordingly
        const productsArray = data.data;

        if (Array.isArray(productsArray)) {
            // Format the products
            const formattedProducts = productsArray.map((product) => ({
                ...product,
                image: product.images.site1,
                description: product.descriptions.site1,
                use: product.uses.site1,
            }));

            return formattedProducts;
        } else {
            throw new Error("Fetched data is not an array");
        }
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
};

