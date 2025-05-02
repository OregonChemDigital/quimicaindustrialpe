import { API_ENDPOINTS } from '../config/api';

export const fetchPresentations = async () => {
    try {
        const response = await fetch(API_ENDPOINTS.PRESENTATIONS);
        if (!response.ok) {
            throw new Error('Failed to fetch presentations');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching presentations:', error);
        throw error;
    }
};
