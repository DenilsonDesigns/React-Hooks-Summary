import React, { useState, useEffect, useCallback } from "react";
import IngredientForm from "./IngredientForm/IngredientForm";
import IngredientList from "./IngredientList/IngredientList";
import Search from "./Search/Search";

const BASE_URL =
  "https://react-hooks-summary-add5d-default-rtdb.asia-southeast1.firebasedatabase.app/";

const Ingredients = () => {
  const [ingredients, setIngredients] = useState([]);

  // // when useEffect is used like this (with empty array as second arg.) /
  // // then it becomes like "componentDidMount()"
  // useEffect(() => {
  //   // useEffect runs AFTER every single render cycle if no dependency passed\
  //   // as second argument.
  //   fetch(`${BASE_URL}/ingredients.json`)
  //     .then((res) => res.json())
  //     .then((resData) => {
  //       const loadedIng = [];
  //       for (const key in resData) {
  //         loadedIng.push({
  //           id: key,
  //           title: resData[key].title,
  //           amount: resData[key].amount,
  //         });
  //       }
  //       setIngredients(loadedIng);
  //     });
  // }, []);

  useEffect(() => {
    console.log("Rendering Ingredients", ingredients);
  }, [ingredients]);

  const addIngredientHandler = (ingredient) => {
    fetch(`${BASE_URL}/ingredients.json`, {
      method: "POST",
      body: JSON.stringify(ingredient),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((resData) => {
        setIngredients((prevIngredients) => [
          ...prevIngredients,
          { id: resData.name, ...ingredient },
        ]);
      });
  };

  const removeIngredientHandler = (ingredientId) => {
    setIngredients((prevIngredients) =>
      prevIngredients.filter((ing) => ing.id !== ingredientId)
    );
  };

  // using useCallback like this means it survices re-render cycles. /
  // meaning that it wont have "changed", and then wont cause /
  // Search.jsx to re-render if it has onLoadIngredients as a /
  // dependency in a useEffect.
  const filterIngHandler = useCallback((filteredIng) => {
    setIngredients(filteredIng);
  }, []);

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search onLoadIngredients={filterIngHandler} />
        <IngredientList
          ingredients={ingredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  );
};

export default Ingredients;
