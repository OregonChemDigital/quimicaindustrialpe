import { API_ENDPOINTS } from '../config/api';

export const fetchPresentations = async () => {
    try {
        const response = await fetch(API_ENDPOINTS.PRESENTATIONS);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const { data } = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Error fetching presentations:", error);
        throw error;
    }
};
