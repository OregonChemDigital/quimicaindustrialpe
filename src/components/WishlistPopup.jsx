import React from 'react';
import '../styles/WishlistPopup.css';

const WishlistPopup = ({ wishlist, handleRemoveFromWishlist }) => {
    return (
        <div className="wishlist-popup">
            <h2>Lista de deseos</h2>
            <ul>
                {wishlist.map((product) => (
                    <li key={product._id}> {/* Ensure unique key */}
                        {product.name}
                        <button onClick={() => handleRemoveFromWishlist(product._id)}>X</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default WishlistPopup;



