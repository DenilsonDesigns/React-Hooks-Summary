import React, { useState, useEffect } from "react";

import Card from "../../UI/Card";
import "./Search.css";

const BASE_URL =
  "https://react-hooks-summary-add5d-default-rtdb.asia-southeast1.firebasedatabase.app/";

const Search = React.memo((props) => {
  const { onLoadIngredients } = props;
  const [enteredFilter, setEnteredFilter] = useState("");

  useEffect(() => {
    const query =
      enteredFilter.length === 0
        ? ""
        : `?orderBy="title"&equalTo="${enteredFilter}"`;
    fetch(`${BASE_URL}/ingredients.json${query}`)
      .then((res) => res.json())
      .then((resData) => {
        const loadedIng = [];
        for (const key in resData) {
          loadedIng.push({
            id: key,
            title: resData[key].title,
            amount: resData[key].amount,
          });
        }
        onLoadIngredients(loadedIng);
      });
  }, [enteredFilter, onLoadIngredients]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            type="text"
            value={enteredFilter}
            onChange={(e) => setEnteredFilter(e.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
