import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <Link to={`/product/${product.id}`} className="group">
      <div className="overflow-hidden rounded-md mb-3 bg-gray-100">
        {product.imageUrl && (
          <img
            src={product.imageUrl.startsWith('http') ? product.imageUrl : `http://localhost:5000${product.imageUrl}`}
            alt={product.name}
            className="h-60 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
      </div>
      <h3 className="font-medium text-lg">{product.name}</h3>
      <div className="flex items-center gap-2">
        <p className="font-medium">₹ {product.price}</p>
        {product.originalPrice && (
          <p className="text-gray-500 line-through text-sm">₹ {product.originalPrice}</p>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
