import React, { useCallback, useState } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';

function Ingredients() {
  const [userIngredients, setUserIngredients] = useState([]);
  const [isLoading, setIsloading] = useState(false);
  const [error, setError] = useState();

  console.log(userIngredients);

  // filter ingredients

  const onFilteredIngredientsHandler = useCallback((filterdIngredients) => {
    setUserIngredients(filterdIngredients);
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
        setUserIngredients((prevState) => {
          return [...prevState, { ...ingredient }];
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
        setUserIngredients(
          userIngredients.filter((ingredient) => ingredient.id !== id)
        );
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
