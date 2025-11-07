import { Box } from "@mui/material";
import { Outlet } from "react-router";
import Header from "../components/Header";

export default function MainLayout() {
  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        minHeight: "100vh",
        p: 0,
        m: 0,
      }}
    >
      <Header />
      <Box
        sx={{
          m: 2,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
