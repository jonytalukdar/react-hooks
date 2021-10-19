import React, { useEffect, useRef } from 'react';
import { useState } from 'react/cjs/react.development';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(({ onLoadIngredients }) => {
  const [enteredFilter, setEnteredFilter] = useState('');
  const inputRef = useRef();

  useEffect(() => {
    const clear = setTimeout(() => {
      if (enteredFilter === inputRef.current.value) {
        const query =
          enteredFilter.length === 0
            ? ''
            : `?orderBy="title"&equalTo="${enteredFilter}"`;

        fetch(
          'https://portfolio-5220b-default-rtdb.asia-southeast1.firebasedatabase.app/ingredients.json' +
            query
        )
          .then((response) => response.json())
          .then((data) => {
            const loadedData = [];

            for (const key in data) {
              const newIngredients = {
                id: key,
                ...data[key],
              };
              loadedData.push(newIngredients);
            }

            onLoadIngredients(loadedData);
          });
      }
    }, 500);

    return () => {
      clearTimeout(clear);
    };
  }, [enteredFilter, onLoadIngredients, inputRef]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            type="text"
            ref={inputRef}
            value={enteredFilter}
            onChange={(e) => setEnteredFilter(e.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
