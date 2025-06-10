export interface Product {
    _id: string;
    name: string;
    descriptions: string;
    images: string;
    uses: string;
    presentations: {
        name: string;
    }[];
    categories: {
        name: string;
    }[];
    seo?: {
        title?: string;
        description?: string;
        keywords?: string[];
    };
} 