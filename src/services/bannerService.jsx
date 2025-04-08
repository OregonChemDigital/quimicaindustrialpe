import { useEffect, useState } from "react";

const useBannerData = () => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const response = await fetch("http://localhost:5001/api/public/banners?site=site1");
                if (!response.ok) throw new Error("Error fetching banners");
                const { data } = await response.json();
                setBanners(Array.isArray(data) ? data : []);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchBanners();
    }, []);

    return { banners, loading, error };
};

export default useBannerData;