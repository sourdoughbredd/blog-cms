// authContext.js
import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { refreshAccessToken } from "../api";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    async function authenticate() {
      console.log("Running authentication effect...");
      // Check for the presence and validity of the JWT during initialization
      const accessToken = localStorage.getItem("jwtAccessToken");
      const refreshToken = localStorage.getItem("jwtRefreshToken");

      if (accessToken) {
        // Validate the access token (check expiration, etc.)
        const isValidToken = validateToken(accessToken);

        console.log("Is token valid: " + isValidToken);

        if (isValidToken) {
          setAuthenticated(true);
        } else {
          localStorage.removeItem("jwtAccessToken");
          setAuthenticated(false);
        }
      } else if (refreshToken) {
        // Try refresh
        console.log("Trying jwt refresh...");
        const { user_id, exp } = jwtDecode(refreshToken);
        if (user_id && exp > Date.now() / 1000) {
          // Valid token, request refresh from server
          const response = await refreshAccessToken(refreshToken);
          if (response.accessToken) {
            localStorage.setItem("jwtAccessToken", response.accessToken);
            console.log("JWT refresh success!");
          } else {
            console.log(
              "Server error while trying to refresh JWT access token. Server response:"
            );
            console.log(response);
          }
        } else {
          // Invalid or expired refresh token. Fresh login required.
          console.log(
            "Invalid or expired JWT refresh token. Fresh login required."
          );
        }
      }
    }
    authenticate();
  }, []);

  return (
    <AuthContext.Provider value={{ authenticated, setAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

const validateToken = (token) => {
  // Example validation logic (check expiration, signature, etc.)
  const { user_id, exp } = jwtDecode(token);
  return user_id && exp > Date.now() / 1000; // Return true for demonstration purposes
};

export { AuthContext, AuthProvider };
