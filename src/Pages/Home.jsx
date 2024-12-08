import React, { useState, useEffect, Suspense } from 'react';
const RecipeCard = React.lazy(() => import('../Components/RecipeCard'));
import axios from 'axios';
import '../Styles/Home.css';


const API_KEY = 'dccc369652aa4e7e8950df8d43f78dcc';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  useEffect(() => {
    fetchRandomRecipes();
  }, []);

  const fetchRandomRecipes = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/random`,
        {
          params: {
            number: 10,
            apiKey: API_KEY,
          },
        }
      );
      setRecipes(response.data.recipes);
    } catch (err) {
      setError('Failed to fetch random recipes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (debouncedSearchQuery) {
      searchRecipes();
    }
  }, [debouncedSearchQuery]);

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const searchRecipes = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/complexSearch`,
        {
          params: {
            query: debouncedSearchQuery,
            apiKey: API_KEY,
            number: 10,
          },
        }
      );

      setRecipes(response.data.results);
    } catch (err) {
      setError('Failed to fetch search results');
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = (recipe) => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    if (!storedFavorites.find(fav => fav.id === recipe.id)) {
      const updatedFavorites = [...storedFavorites, recipe];
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchRecipes();
    }
  };

  return (
    <div className='home-page'>
      <h2>Find Your Favorite Recipes</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={searchQuery}
          placeholder="Search for recipes..."
          onChange={handleInputChange}
          className="search-bar"
        />
        <button type="submit" className="search-button">Search</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      <div className="recipe-list">
        {recipes.length > 0 ? (
          <Suspense fallback={<div>Loading Recipes...</div>}>
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onAddToFavorites={addToFavorites}
              />
            ))}
          </Suspense>
        ) : (
          <p>No recipes to display</p>
        )}
      </div>
    </div>
  );
};

export default Home;
