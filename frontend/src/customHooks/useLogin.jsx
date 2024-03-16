import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();

  const login = async (username, password) => {
    setIsLoading(true);
    setError(null);

    // fetch data from server
    const response = await fetch("http://localhost:4000/api/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    // get data from response
    const jsonData = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(jsonData.error);
    }

    if (response.ok) {
      // save to local storage
      localStorage.setItem("user", JSON.stringify(jsonData));

      // update AuthContext
      dispatch({ type: "LOGIN", payload: jsonData });

      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
};
