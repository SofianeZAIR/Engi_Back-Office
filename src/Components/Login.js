import { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function LoginPage({ setLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      setLoggedIn(true);
      navigate("/dashboard");
    } else {
      alert("Erreur d'authentification");
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{ display: "flex", justifyContent: "center", marginTop: 8 }}
    >
      <Paper
        elevation={4}
        sx={{
          padding: 4,
          width: "100%",
          borderRadius: 3,
          textAlign: "center",
        }}
      >
        <Box sx={{ mb: 3 }}>
          <img
            src="/engie_login.png"
            alt="Logo"
            style={{
              height: 80,
              marginBottom: 8,
            }}
          />
          <Typography variant="h4" gutterBottom>
            Connexion
          </Typography>
        </Box>
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Mot de passe"
          fullWidth
          type="password"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          variant="contained"
          fullWidth
          onClick={handleLogin}
          sx={{
            mt: 2,
            backgroundColor: "#00BFFF",
            boxShadow: "0 4px 10px rgba(0, 191, 255, 0.4)",
            borderBottom: "3px solid #b3ecff",
          }}
        >
          Se connecter
        </Button>
      </Paper>
    </Container>
  );
}
