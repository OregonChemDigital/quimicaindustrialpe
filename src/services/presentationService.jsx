export const fetchPresentations = async () => {
    try {
        const response = await fetch("http://localhost:5001/api/public/presentaciones");
        if (!response.ok) throw new Error("Error fetching presentations");
        const { data } = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Error fetching presentations:", error);
        throw error;
    }
};
