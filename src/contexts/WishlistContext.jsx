import React, { createContext, useState, useContext, useEffect } from 'react';
import { safeLogEvent } from '../utils/analytics';

const defaultContext = {
    wishlist: [],
    addToWishlist: () => {},
    removeFromWishlist: () => {},
    clearWishlist: () => {}
};

const WishlistContext = createContext(defaultContext);

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState([]);

    useEffect(() => {
        const savedWishlist = localStorage.getItem('wishlist');
        if (savedWishlist) {
            setWishlist(JSON.parse(savedWishlist));
        }
    }, []);

    const addToWishlist = (product) => {
        setWishlist(prevWishlist => {
            if (!product || !product._id) {
                console.error('Invalid product:', product);
                return prevWishlist;
            }

            if (prevWishlist.some(item => item._id === product._id)) {
                return prevWishlist;
            }

            const updatedList = [...prevWishlist, product];
            
            try {
                localStorage.setItem('wishlist', JSON.stringify(updatedList));
            } catch (error) {
                console.error('Error saving wishlist to localStorage:', error);
            }

            safeLogEvent('add_to_wishlist', {
                product_id: product._id,
                product_name: product.name
            });

            return updatedList;
        });
    };

    const removeFromWishlist = (productId) => {
        setWishlist(prevWishlist => {
            if (!productId) {
                console.error('Invalid productId:', productId);
                return prevWishlist;
            }

            const updatedList = prevWishlist.filter(item => item._id !== productId);
            
            try {
                localStorage.setItem('wishlist', JSON.stringify(updatedList));
            } catch (error) {
                console.error('Error saving wishlist to localStorage:', error);
            }

            safeLogEvent('remove_from_wishlist', {
                product_id: productId
            });

            return updatedList;
        });
    };

    const clearWishlist = () => {
        setWishlist([]);
        localStorage.removeItem('wishlist');
        safeLogEvent('clear_wishlist');
    };

    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, clearWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};



