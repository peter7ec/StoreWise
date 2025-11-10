import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createTheme, ThemeProvider } from "@mui/material";
import HomePage from "./pages/HomePage";
import { BrowserRouter, Route, Routes } from "react-router";
import MainLayout from "./layouts/MainLayout";
import LoginPage from "./pages/LoginPage";

const theme = createTheme();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" index element={<HomePage />} />
            <Route path="/login" index element={<LoginPage />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
