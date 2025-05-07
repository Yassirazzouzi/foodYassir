import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './List.css';

const List = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/foods/all');
      // Check if response.data is an array, if not, check for response.data.foods
      const foodsData = Array.isArray(response.data) ? response.data : response.data.foods || [];
      setFoods(foodsData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching foods:', err);
      setError('Erreur lors du chargement des produits');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        await axios.delete(`http://localhost:4000/api/foods/${id}`);
        setFoods(foods.filter(food => food._id !== id));
      } catch (err) {
        setError('Erreur lors de la suppression');
      }
    }
  };

  // Add a check before mapping
  const renderProducts = () => {
    if (!Array.isArray(foods) || foods.length === 0) {
      return <div className="no-products">Aucun produit trouvé</div>;
    }

    return foods.map((food) => (
      <div key={food._id} className="product-card">
        <img 
          src={`http://localhost:4000${food.imageUrl}`} 
          alt={food.name} 
          className="product-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'placeholder-image-url';
          }}
        />
        <div className="product-info">
          <h3>{food.name}</h3>
          <p className="category">{food.category}</p>
          <p className="description">
            {food.description ? food.description.substring(0, 100) + '...' : 'Pas de description'}
          </p>
          <div className="product-details">
            <span>Calories: {food.details?.calories || 'N/A'}</span>
            <span>Temps: {food.details?.time || 'N/A'}</span>
          </div>
        </div>
        <div className="product-actions">
          <Link to={`/edit/${food._id}`} className="edit-button">
            Modifier
          </Link>
          <button 
            onClick={() => handleDelete(food._id)} 
            className="delete-button"
          >
            Supprimer
          </button>
        </div>
      </div>
    ));
  };

  if (loading) return <div className="loading">Chargement...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="list-container">
      <div className="list-header">
        <h2>Liste des Produits</h2>
        <Link to="/add" className="add-button">
          Ajouter un produit
        </Link>
      </div>

      <div className="products-grid">
        {renderProducts()}
      </div>
    </div>
  );
};

export default List;
