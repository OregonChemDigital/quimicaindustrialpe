import { analytics } from '../firebase';
import { logEvent } from 'firebase/analytics';

export const safeLogEvent = (eventName, eventParams = {}) => {
    if (analytics) {
        try {
            logEvent(analytics, eventName, eventParams);
        } catch (error) {
            // Only log errors in development
            if (process.env.NODE_ENV === 'development') {
                console.error('Error logging analytics event:', error);
            }
        }
    }
};

export const trackPageView = (pageName) => {
    safeLogEvent('page_view', {
        page_name: pageName,
        page_location: window.location.href,
        page_title: document.title
    });
};

export const trackProductView = (productId, productName) => {
    safeLogEvent('view_item', {
        item_id: productId,
        item_name: productName,
        item_category: 'product'
    });
};

export const trackSearch = (searchTerm) => {
    safeLogEvent('search', {
        search_term: searchTerm
    });
};

export const trackCategoryView = (categoryId, categoryName) => {
    safeLogEvent('view_item_list', {
        item_list_id: categoryId,
        item_list_name: categoryName
    });
};

// New tracking functions for specific events
export const trackHeroCotizarClick = () => {
    safeLogEvent('hero_cotizar_click', {
        location: 'hero_section',
        page: 'homepage'
    });
};

export const trackFeaturedCotizarClick = () => {
    safeLogEvent('featured_cotizar_click', {
        location: 'featured_section',
        page: 'homepage'
    });
};

export const trackWishlistCotizarClick = () => {
    safeLogEvent('wishlist_cotizar_click', {
        location: 'wishlist_popup',
        page: 'wishlist'
    });
};

export const trackNavbarCotizarClick = () => {
    safeLogEvent('navbar_cotizar_click', {
        location: 'navbar',
        page: window.location.pathname
    });
};

export const trackNavbarProductosClick = () => {
    safeLogEvent('navbar_productos_click', {
        location: 'navbar',
        page: window.location.pathname
    });
};

export const trackWishlistPopupOpen = () => {
    safeLogEvent('wishlist_popup_open', {
        location: 'wishlist',
        page: window.location.pathname
    });
};

export const trackQuoteFormSubmission = (source) => {
    safeLogEvent('quote_form_submission', {
        source: source,
        page: window.location.pathname
    });
}; 