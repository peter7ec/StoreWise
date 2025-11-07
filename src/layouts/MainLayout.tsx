import { Box, Container } from "@mui/material";
import { Outlet } from "react-router";

export default function MainLayout() {
  return (
    <Container maxWidth="md" disableGutters sx={{ py: 3 }}>
      <Box
        component="header"
        sx={{ mb: 2, p: 2, bgcolor: "grey.100", borderRadius: 1 }}
      >
        Header
      </Box>

      <Box sx={{ padding: 20, bgcolor: "primary.light", borderRadius: 1 }}>
        <Outlet />
      </Box>
    </Container>
  );
}
