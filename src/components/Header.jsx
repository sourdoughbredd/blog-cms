import styles from "./Header.module.css";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { logout as postLogout } from "../api";

const logout = async () => {
  // Delete access token from local storage
  localStorage.removeItem("jwtAccessToken");
  // Collect refresh token and delete from local storage
  const refreshToken = localStorage.getItem("jwtRefreshToken");
  localStorage.removeItem("jwtRefreshToken");
  // Send request to server to expire the refresh token
  if (refreshToken) {
    const response = await postLogout(refreshToken);
    if (response.error) {
      console.error(
        "Problem processing logout on server side. Server response:"
      );
      console.error(response);
    }
  }
};

const Logo = () => (
  <div className="logo">
    <h1>
      <a href="/">blog cms</a>
    </h1>
  </div>
);

const Links = () => {
  const { authenticated } = useContext(AuthContext);

  if (authenticated) {
    return (
      <ul className={styles.links}>
        <li>
          <a href="/" onClick={logout}>
            Logout
          </a>
        </li>
      </ul>
    );
  } else {
    return (
      <ul className={styles.links}>
        <li>
          <a href="/users/login">Login</a>
        </li>
        <li>
          <a href="/users/signup">Signup</a>
        </li>
      </ul>
    );
  }
};

const Header = () => {
  return (
    <header className={styles.header}>
      <Logo />
      <Links />
    </header>
  );
};

export default Header;
