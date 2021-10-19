import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';
import { useReducer } from 'react/cjs/react.development';

const ingredientReducer = (state, action) => {
  switch (action.type) {
    case 'SET': {
      return action.ingredients;
    }

    case 'ADD': {
      return [...state, action.ingredient];
    }

    case 'DELETE': {
      return state.filter((ing) => ing.id !== action.id);
    }

    default:
      throw new Error('Should not get there');
  }
};

// reducer for httpRequest

const httpReducer = (state, action) => {
  switch (action.type) {
    case 'SEND': {
      return { isLoading: true, error: null };
    }

    case 'RESPONSE': {
      return { ...state, isLoading: false };
    }

    case 'ERROR': {
      return { ...state, error: action.errorMessage };
    }

    case 'CLEAR': {
      return { isLoading: false, error: null };
    }

    default:
      throw new Error('Should not get !');
  }
};

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const [httpState, dispatchHttp] = useReducer(httpReducer, {
    isLoading: false,
    error: null,
  });

  console.log(userIngredients);

  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
    dispatch({ type: 'SET', ingredients: filteredIngredients });
  }, []);

  const addIngredientHandler = (ingredient) => {
    dispatchHttp({ type: 'SEND' });
    fetch(
      'https://portfolio-5220b-default-rtdb.asia-southeast1.firebasedatabase.app/ingredients.json',
      {
        method: 'POST',
        body: JSON.stringify(ingredient),
        headers: { 'Content-Type': 'application/json' },
      }
    )
      .then((response) => {
        dispatchHttp({ type: 'RESPONSE' });
        return response.json();
      })
      .then((responseData) => {
        dispatch({
          type: 'ADD',
          ingredient: { id: responseData.name, ...ingredient },
        });
      })
      .catch((err) => {
        dispatchHttp({ type: 'ERROR', errorMessage: 'Something went wrong!' });
      });
  };

  const removeIngredientHandler = (ingredientId) => {
    dispatchHttp({ type: 'SEND' });
    fetch(
      `https://portfolio-5220b-default-rtdb.asia-southeast1.firebasedatabase.app/ingredients/${ingredientId}.json`,
      {
        method: 'DELETE',
      }
    )
      .then((response) => {
        dispatchHttp({ type: 'RESPONSE' });
        dispatch({ type: 'DELETE', id: ingredientId });
      })
      .catch((error) => {
        dispatchHttp({ type: 'ERROR', errorMessage: 'Something went wrong!' });
      });
  };

  const clearError = () => {
    dispatchHttp({ type: 'CLEAR' });
  };

  return (
    <div className="App">
      {httpState.error && (
        <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>
      )}

      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={httpState.isLoading}
      />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList
          ingredients={userIngredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  );
};

export default Ingredients;
