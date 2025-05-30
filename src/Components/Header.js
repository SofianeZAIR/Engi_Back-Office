import { Link, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";

export default function Header({ setLoggedIn, loggedIn }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await fetch(`${process.env.REACT_APP_API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    setLoggedIn(false);
    navigate("/login");
  };

  return (
    <AppBar
      position="relative"
      sx={{
        margin: 0,
        backgroundColor: "#00BFFF",
        boxShadow: "0 4px 10px rgba(0, 191, 255, 0.4)",
        borderBottom: "3px solid #b3ecff",
        minHeight: "65px",
      }}
    >
      <Toolbar>
        <Box
          component="img"
          src="/engie_logo.png"
          alt="Logo Engie"
          sx={{
            height: 65,
            width: "auto",
            marginRight: 2,
          }}
        />
        <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: "bold" }}>
          Back Office Engie
        </Typography>
        <Box display="flex" gap={2}>
          {!loggedIn ? (
            <Button
              variant="text"
              component={Link}
              to="/login"
              sx={{
                backgroundColor: "#00BFFF",
                color: "#ffffff",
                textTransform: "none",
                fontSize: "24px",
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: "#e0f7fa",
                  color: "#00BFFF",
                },
              }}
            >
              Connexion
            </Button>
          ) : (
            <>
              <Button
                variant="text"
                component={Link}
                to="/dashboard"
                sx={{
                  fontSize: "24px",
                  fontWeight: 600,
                  backgroundColor: "#00BFFF",
                  color: "#ffffff",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "#e0f7fa",
                    color: "#00BFFF",
                  },
                }}
              >
                Dashboard
              </Button>
              <Button
                variant="text"
                onClick={handleLogout}
                sx={{
                  backgroundColor: "#00BFFF",
                  color: "#ffffff",
                  textTransform: "none",
                  fontSize: "24px",
                  fontWeight: 600,
                  "&:hover": {
                    backgroundColor: "#e60000",
                  },
                }}
              >
                Déconnexion
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
