import React, { useReducer, useCallback, useEffect } from "react";
import IngredientForm from "./IngredientForm/IngredientForm";
import IngredientList from "./IngredientList/IngredientList";
import Search from "./Search/Search";
import ErrorModal from "../UI/ErrorModal";
import useHttp from "../../hooks/http";

const BASE_URL =
  "https://react-hooks-summary-add5d-default-rtdb.asia-southeast1.firebasedatabase.app/";

const ingredientReducer = (currentIng, action) => {
  switch (action.type) {
    case "SET":
      return action.ingredients;
    case "ADD":
      return [...currentIng, action.ingredient];
    case "DELETE":
      return currentIng.filter((ing) => ing.id !== action.id);
    default:
      throw new Error("Should not get to default switch.");
  }
};

const Ingredients = () => {
  const [ingredients, dispatchIngredients] = useReducer(ingredientReducer, []);
  const {
    isLoading,
    error,
    data,
    sendRequest,
    reqExtra,
    reqIdentifier,
    clearState,
  } = useHttp();

  useEffect(() => {
    if (!isLoading && !error && reqIdentifier === "REMOVE_INGREDIENT") {
      dispatchIngredients({ type: "DELETE", id: reqExtra });
    } else if (!isLoading && !error && reqIdentifier === "ADD_INGREDIENT") {
      dispatchIngredients({
        type: "ADD",
        ingredient: {
          id: data.name,
          ...reqExtra,
        },
      });
    }
  }, [data, reqExtra, reqIdentifier, isLoading, error]);

  const addIngredientHandler = useCallback(
    (ingredient) => {
      sendRequest(
        BASE_URL,
        "ingredients.json",
        "POST",
        JSON.stringify(ingredient),
        ingredient,
        "ADD_INGREDIENT"
      );
    },
    [sendRequest]
  );

  const removeIngredientHandler = useCallback(
    (ingredientId) => {
      const TAIL_URL = `ingredients/${ingredientId}.json`;
      sendRequest(
        BASE_URL,
        TAIL_URL,
        "DELETE",
        null,
        ingredientId,
        "REMOVE_INGREDIENT"
      );
    },
    [sendRequest]
  );

  const filterIngHandler = useCallback((filteredIng) => {
    dispatchIngredients({ type: "SET", ingredients: filteredIng });
  }, []);

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearState}>{error}</ErrorModal>}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={isLoading}
      />

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
