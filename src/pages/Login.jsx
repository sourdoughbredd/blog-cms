import { useContext } from "react";
import { login } from "../api";
import { AuthContext } from "../context/authContext";

const Login = () => {
  const { authenticated, setAuthenticated } = useContext(AuthContext);

  console.log("Login page authenticated status: " + authenticated);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const username = formData.get("username");
    const password = formData.get("password");

    try {
      const response = await login(username, password);
      if (response.error) {
        alert("Error logging in. Check console for details.");
        console.log("Error logging in with response...");
        console.error(response);
      } else {
        localStorage.setItem("jwtAccessToken", response.tokens.accessToken);
        localStorage.setItem("jwtRefreshToken", response.tokens.refreshToken);
        setAuthenticated(true);
        console.log("Successful login!");
        window.location.href = "/";
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (authenticated) {
    return (
      <>
        <h1>Login</h1>
        <h3>You are logged in.</h3>
      </>
    );
  }

  return (
    <>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input type="text" name="username" required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" name="password" required />
        </div>
        <button type="submit" name="postId">
          Log In
        </button>
      </form>
    </>
  );
};

export default Login;
