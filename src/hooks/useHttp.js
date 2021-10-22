import { useReducer } from 'react';
import { useCallback } from 'react/cjs/react.development';

// reducer for httpRequest

const httpReducer = (state, action) => {
  switch (action.type) {
    case 'SEND': {
      return {
        isLoading: true,
        error: null,
        data: null,
        extra: null,
        identifier: action.identifier,
      };
    }

    case 'RESPONSE': {
      return {
        ...state,
        isLoading: false,
        data: action.responseData,
        extra: action.extra,
      };
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

const useHttp = () => {
  const [httpState, dispatchHttp] = useReducer(httpReducer, {
    isLoading: false,
    error: null,
    data: null,
    extra: null,
    identifier: null,
  });

  const sendRequest = useCallback(
    (url, method, body, reqExtra, reqIdentifier) => {
      dispatchHttp({ type: 'SEND', identifier: reqIdentifier });
      fetch(url, {
        method: method,
        body: body,
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          response.json();
        })
        .then((responseData) => {
          dispatchHttp({
            type: 'RESPONSE',
            responseData: responseData,
            extra: reqExtra,
          });
        })
        .catch((error) => {
          dispatchHttp({
            type: 'ERROR',
            errorMessage: 'Something went wrong!',
          });
        });
    },
    []
  );

  return {
    isLoading: httpState.isLoading,
    error: httpState.error,
    data: httpState.data,
    sendRequest: sendRequest,
    reqExtra: httpState.extra,
    reqIdentifier: httpState.identifier,
  };
};

export default useHttp;
