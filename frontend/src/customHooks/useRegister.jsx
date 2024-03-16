import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useRegister = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();

  const register = async (userId, email, name, password) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch("http://localhost:4000/api/user/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        email,
        name,
        password,
      }),
    });

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

  return { register, isLoading, error };
};
