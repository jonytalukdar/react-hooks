import React, { useCallback, useState } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

function Ingredients() {
  const [userIngredients, setUserIngredients] = useState([]);

  console.log(userIngredients);

  // filter ingredients

  const onFilteredIngredientsHandler = useCallback((filterdIngredients) => {
    setUserIngredients(filterdIngredients);
  }, []);

  const addIngredientsHandler = (ingredient) => {
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
      .then((res) => res.json())
      .then((data) => {
        setUserIngredients((prevState) => {
          return [...prevState, { id: data.title, ...ingredient }];
        });
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
