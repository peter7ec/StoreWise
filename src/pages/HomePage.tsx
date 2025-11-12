import { Box, Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import { useAuth } from "../services/authContext";

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleNavigate = (url: string) => {
    navigate(url);
  };
  return (
    <Box sx={{ textAlign: "center" }}>
      <Typography
        variant="h1"
        sx={{ mb: 5, color: "#2196f3", fontSize: { xs: 35, xl: 50 } }}
      >
        Üdvözöljük a StoreWise-on!
      </Typography>
      <Container
        sx={{ bgcolor: "#2196f3", color: "white", borderRadius: 2, p: 2 }}
      >
        <Typography variant="body1">
          Egy saját bevásárló lista vezető oldal ahol te mondod meg, hogy mit
          honnan szeretnél megvásárolni és ezt egy átlátható listába láthatod!
        </Typography>
        {!user && (
          <Container
            sx={{ mt: 2, display: "flex", justifyContent: "space-around" }}
          >
            <Button
              variant="contained"
              sx={{ bgcolor: "white", color: "#2196f3", mr: { xs: 2 } }}
              onClick={() => handleNavigate("/login")}
            >
              Bejelentkezés
            </Button>
            <Button
              variant="contained"
              sx={{ bgcolor: "#64b2f3b4", color: "white" }}
              onClick={() => handleNavigate("/register")}
            >
              Regisztráció
            </Button>
          </Container>
        )}
      </Container>
    </Box>
  );
}
