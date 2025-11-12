import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createTheme, ThemeProvider } from "@mui/material";
import HomePage from "./pages/HomePage";
import { BrowserRouter, Route, Routes } from "react-router";
import MainLayout from "./layouts/MainLayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { AuthProvider } from "./services/authProvider";
import { ProtectedRoute } from "./components/ProtectedRoute";
import ListsPage from "./pages/ListsPage";
import { PrivateRoute } from "./components/PrivateRoute";

const theme = createTheme();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <Routes>
            <Route path="/__/auth/*" element={null} />
            <Route element={<MainLayout />}>
              <Route path="/" index element={<HomePage />} />
              <Route
                path="/login"
                index
                element={
                  <ProtectedRoute>
                    <LoginPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/register"
                index
                element={
                  <ProtectedRoute>
                    <RegisterPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/lists"
                element={
                  <PrivateRoute>
                    <ListsPage />
                  </PrivateRoute>
                }
              />
            </Route>
          </Routes>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
