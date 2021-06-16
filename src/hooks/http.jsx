import { useReducer, useCallback } from "react";

const initialState = {
  loading: false,
  error: null,
  data: null,
  extra: null,
  identifier: null,
};

const httpReducer = (currHttpState, action) => {
  switch (action.type) {
    case "SEND":
      return {
        loading: true,
        error: null,
        data: null,
        extra: null,
        identifier: action.identifier,
      };
    case "RESPONSE":
      return {
        ...currHttpState,
        loading: false,
        data: action.responseData,
        extra: action.extra,
      };
    case "ERROR":
      return { loading: false, error: action.errorMsg };
    case "CLEAR":
      return initialState;
    default:
      throw new Error("Should not be reached!");
  }
};

const useHttp = () => {
  const [httpState, dispatchHttpState] = useReducer(httpReducer, initialState);

  const clearState = useCallback(
    () => dispatchHttpState({ type: "CLEAR" }),
    []
  );

  const sendRequest = useCallback(
    (baseUrl, tailUrl, method, body, reqExtra, reqIdentifier) => {
      dispatchHttpState({ type: "SEND", identifier: reqIdentifier });

      //   fetch(`${BASE_URL}/ingredients/${ingredientId}.json`, {
      fetch(`${baseUrl}${tailUrl}`, {
        method: method,
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((resData) => {
          dispatchHttpState({
            type: "RESPONSE",
            responseData: resData,
            extra: reqExtra,
          });
        })
        .catch((err) => {
          dispatchHttpState({ type: "ERROR", errorMsg: err.message });
        });
    },
    []
  );

  return {
    isLoading: httpState.loading,
    data: httpState.data,
    error: httpState.error,
    sendRequest: sendRequest,
    reqExtra: httpState.extra,
    reqIdentifier: httpState.identifier,
    clearState: clearState,
  };
};

export default useHttp;
