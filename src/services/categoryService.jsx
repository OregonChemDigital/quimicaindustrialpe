import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from '../config/api';

// Add a new function to fetch categories for the sidebar
export const fetchCategories = async () => {
  try {
    const response = await fetch(API_ENDPOINTS.CATEGORIES);
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

const CategoryData = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoriesData();
  }, []);

  const handleCategoryClick = (category) => {
    navigate(`/productos?category=${category.name}`);
  };

  if (loading) return <div>Cargando categorías...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container">
      <h3 className="category-header">Categorías</h3>
      <div className="category-container">
        {categories.map((category) => (
          <div
            key={category._id}
            className="category-card"
            style={{
              backgroundImage: `url(${category.images?.site1})`,
            }}
            onClick={() => handleCategoryClick(category)}
          >
            <div className="category-title">{category.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryData;



