import { useEffect, useState } from "react";

const BannerData = () => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const response = await fetch("https://oregonchem-backend.onrender.com/api/public/banners?site=site1");
                const data = await response.json();
                setBanners(data);
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

export default BannerData;