export const fetchPresentations = async () => {
    try {
        const response = await fetch("https://oregonchem-backend.onrender.com/api/public/presentaciones");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching presentations:", error);
        throw error;
    }
};
