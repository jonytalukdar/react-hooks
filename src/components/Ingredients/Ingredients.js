import React from 'react';
import { useState } from 'react/cjs/react.development';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

function Ingredients() {
  const [userIngredients, setUserIngredients] = useState([]);

  const addIngredientsHandler = (ingredient) => {
    setUserIngredients((prevState) => {
      return [...prevState, ingredient];
    });
  };

  const removeIngredientsHandler = (id) => {
    setUserIngredients(
      userIngredients.filter((ingredient) => ingredient.id !== id)
    );
  };

  return (
    <div className="App">
      <IngredientForm onAddIngredients={addIngredientsHandler} />

      <section>
        <Search />
        <IngredientList
          ingredients={userIngredients}
          onRemoveIngredients={removeIngredientsHandler}
        />
      </section>
    </div>
  );
}

export default Ingredients;
