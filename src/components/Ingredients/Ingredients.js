import React, { useReducer, useCallback, useState } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';

const ingredientReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...state, action.ingredient];
    case 'DELETE':
      return state.filter((ing) => ing.id !== action.id);

    default:
      throw new Error('Should not get there!');
  }
};

function Ingredients() {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);

  const [isLoading, setIsloading] = useState(false);
  const [error, setError] = useState();

  console.log(userIngredients);

  // filter ingredients
  const onFilteredIngredientsHandler = useCallback((filterdIngredients) => {
    dispatch({ type: 'SET', ingredients: filterdIngredients });
  }, []);

  const addIngredientsHandler = (ingredient) => {
    setIsloading(true);
    fetch(
      'https://portfolio-5220b-default-rtdb.asia-southeast1.firebasedatabase.app/ingredients.json',
      {
        method: 'POST',
        body: JSON.stringify(ingredient),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
      .then((res) => {
        res.json();
        setIsloading(false);
      })
      .then((data) => {
        dispatch({
          type: 'ADD',
          ingredient: { id: ingredient.name, ...ingredient },
        });
      })
      .catch((err) => {
        setError('Something went wrong!');
        setIsloading(false);
      });
  };

  const removeIngredientsHandler = (id) => {
    setIsloading(true);
    fetch(
      `https://portfolio-5220b-default-rtdb.asia-southeast1.firebasedatabase.app/ingredients/${id}.json`,
      {
        method: 'DELETE',
      }
    )
      .then((response) => {
        setIsloading(false);

        dispatch({ type: 'DELETE', id: id });
      })
      .catch((err) => {
        setError('Something went wrong!');
        setIsloading(false);
      });
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
      <IngredientForm
        onAddIngredients={addIngredientsHandler}
        isLoading={isLoading}
      />

      <section>
        <Search onLoadIngredients={onFilteredIngredientsHandler} />
        <IngredientList
          ingredients={userIngredients}
          onRemoveIngredients={removeIngredientsHandler}
        />
      </section>
    </div>
  );
}

export default Ingredients;
