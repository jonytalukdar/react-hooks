import React from 'react';

import './IngredientList.css';

const IngredientList = (props) => {
  return (
    <section className="ingredient-list">
      <h2>Loaded Ingredients</h2>
      <ul>
        {props.ingredients.map((ingredient, index) => (
          <li
            key={index}
            onClick={() => props.onRemoveIngredients(ingredient.id)}
          >
            <span>{ingredient.title}</span>
            <span>{ingredient.amount}x</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default IngredientList;
