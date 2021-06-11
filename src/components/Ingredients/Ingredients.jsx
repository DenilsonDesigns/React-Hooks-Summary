import React, { useState } from "react";
import IngredientForm from "./IngredientForm/IngredientForm";
import IngredientList from "./IngredientList/IngredientList";
import Search from "./Search/Search";

const Ingredients = () => {
  const [ingredients, setIngredients] = useState([]);

  const addIngredientHandler = (ingredient) => {
    setIngredients((prevIngredients) => [
      ...prevIngredients,
      { id: Math.random().toString(), ...ingredient },
    ]);
  };

  const removeIngredientHandler = (ingredientId) => {
    setIngredients((prevIngredients) =>
      prevIngredients.filter((ing) => ing.id !== ingredientId)
    );
  };

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search />
        <IngredientList
          ingredients={ingredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  );
};

export default Ingredients;
