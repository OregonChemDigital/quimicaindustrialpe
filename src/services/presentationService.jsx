export const fetchPresentations = async () => {
    try {
        const response = await fetch("http://localhost:5001/api/public/presentaciones");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching presentations:", error);
        throw error;
    }
};
