import { useEffect, useState } from "react";
import { API_ENDPOINTS } from '../config/api';

const useBannerData = () => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const response = await fetch(`${API_ENDPOINTS.BANNERS}?site=site1`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const { data } = await response.json();
                setBanners(Array.isArray(data) ? data : []);
            } catch (error) {
                setError(error);
                console.error("Error in useBannerData:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBanners();
    }, []);

    return { banners, loading, error };
};

export const fetchBanners = async () => {
    try {
        const response = await fetch(`${API_ENDPOINTS.BANNERS}?site=site1`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const { data } = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Error fetching banners:", error);
        throw error;
    }
};

export default useBannerData;