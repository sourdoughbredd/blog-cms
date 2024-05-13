import "./App.css";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/authContext";

// Components/Pages
import Header from "./components/Header";
import Home from "./pages/Home";
import Post from "./pages/Post";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AddPost from "./pages/AddPost";

// App Layout Component with context providers
const Layout = () => {
  return (
    <AuthProvider>
      <Header />
      <div id="app-main-content-container">
        <Outlet />
      </div>
    </AuthProvider>
  );
};

function App() {
  // Router
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },
        { path: "posts/:postId", element: <Post /> },
        { path: "users/login", element: <Login /> },
        { path: "users/signup", element: <Signup /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
