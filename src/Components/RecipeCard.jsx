import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../Styles/RecipeCard.css';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const RecipeCard = ({ recipe, onAddToFavorites, onRemoveFromFavorites }) => {
  const [clicked, setClicked] = useState(false);

  const handleAddToFavorites = () => {
    onAddToFavorites && onAddToFavorites(recipe);
    setClicked((prev) => !prev);
  };

  return (
    <div className="recipe-card">
      {/* Recipe Image and Title */}
      <Link to={`/recipe/${recipe.id}`} className="recipe-link">
        <img src={recipe.image} alt={recipe.title} className="recipe-image" />
        <div className="recipe-title">{recipe.title}</div>
      </Link>

      {/* Heart Icon */}
      <div className="icon-container">
        <div
          className="favorite-icon"
          onClick={handleAddToFavorites}
          style={{ color: clicked ? '#e8240f' : '#333' }} // Change to orange-red if clicked
        >
          {clicked ? <FaHeart /> : <FaRegHeart />}
        </div>
      </div>

      {/* Details Button */}
      <div className="details-container">
        <Link to={`/recipe/${recipe.id}`} className="details-button">Details</Link>
      </div>
    </div>
  );
};

export default RecipeCard;
