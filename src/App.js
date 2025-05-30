import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./Components/Header";
import Login from "./Components/Login";
import Dashboard from "./Components/Dashboard";
import { CssBaseline } from "@mui/material";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/me`, {
          method: "GET",
          credentials: "include",
        });
        if (res.ok) {
          setLoggedIn(true);
        }
      } catch {
        setLoggedIn(false);
      }
    };

    checkAuth();
  }, []);
  return (
    <Router>
      <CssBaseline />
      <Header setLoggedIn={setLoggedIn} loggedIn={loggedIn} />
      <Routes>
        <Route
          path="/"
          element={<Navigate to={loggedIn ? "/dashboard" : "/login"} replace />}
        />
        <Route path="/login" element={<Login setLoggedIn={setLoggedIn} />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
