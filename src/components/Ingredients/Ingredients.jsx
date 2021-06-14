import React, { useReducer, useCallback } from "react";
import IngredientForm from "./IngredientForm/IngredientForm";
import IngredientList from "./IngredientList/IngredientList";
import Search from "./Search/Search";
import ErrorModal from "../UI/ErrorModal";

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

const httpReducer = (currHttpState, action) => {
  switch (action.type) {
    case "SEND":
      return { loading: true, error: null };
    case "RESPONSE":
      return { ...currHttpState, loading: false };
    case "ERROR":
      return { loading: false, error: action.errorMsg };
    case "CLEAR":
      return { ...currHttpState, error: null };
    default:
      throw new Error("Should not be reached!");
  }
};

const Ingredients = () => {
  // const [ingredients, setIngredients] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState();
  const [ingredients, dispatchIngredients] = useReducer(ingredientReducer, []);
  const [httpState, dispatchHttpState] = useReducer(httpReducer, {
    loading: false,
    error: null,
  });

  // *** Note ***
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
  // ***

  const addIngredientHandler = (ingredient) => {
    // setIsLoading(true);
    dispatchHttpState({ type: "SEND" });
    fetch(`${BASE_URL}/ingredients.json`, {
      method: "POST",
      body: JSON.stringify(ingredient),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        // setIsLoading(false);
        dispatchHttpState({ type: "RESPONSE" });
        return res.json();
      })
      .then((resData) => {
        // setIngredients((prevIngredients) => [
        //   ...prevIngredients,
        //   { id: resData.name, ...ingredient },
        // ]);
        dispatchIngredients({
          type: "ADD",
          ingredient: { id: resData.name, ...ingredient },
        });
      });
  };

  const removeIngredientHandler = (ingredientId) => {
    // setIsLoading(true);
    dispatchHttpState({ type: "SEND" });
    fetch(`${BASE_URL}/ingredients/${ingredientId}.json`, {
      method: "DELETE",
    })
      .then(() => {
        // setIsLoading(false);
        // setIngredients((prevIngredients) =>
        //   prevIngredients.filter((ing) => ing.id !== ingredientId)
        // );
        dispatchHttpState({ type: "RESPONSE" });
        dispatchIngredients({ type: "DELETE", id: ingredientId });
      })
      .catch((err) => {
        // setError("Something went wrong!", err);
        // setIsLoading(false);
        dispatchHttpState({ type: "ERROR", errorMsg: err.message });
      });
  };

  // using useCallback like this means it survives re-render cycles. /
  // meaning that it wont have "changed", and then wont cause /
  // Search.jsx to re-render if it has onLoadIngredients as a /
  // dependency in a useEffect.
  const filterIngHandler = useCallback((filteredIng) => {
    // setIngredients(filteredIng);
    dispatchIngredients({ type: "SET", ingredients: filteredIng });
  }, []);

  const clearError = () => {
    // setError(null);
    dispatchHttpState({ type: "CLEAR" });
  };

  return (
    <div className="App">
      {httpState.error && (
        <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>
      )}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={httpState.loading}
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
