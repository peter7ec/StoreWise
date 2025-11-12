import { Alert, Box, Slide } from "@mui/material";
import { useEffect, useState } from "react";

export type SeverityType = "error" | "warning" | "info" | "success";

interface TopAlertProps {
  message: string;
  severity: SeverityType;
}

export default function TopAlert({ message, severity }: TopAlertProps) {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setOpen(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box
      sx={{
        position: "fixed",
        top: 42,
        left: 0,
        width: "100vw",
        zIndex: 1500,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <Slide in={open} direction="down" mountOnEnter unmountOnExit>
        <Alert
          variant="filled"
          severity={severity}
          sx={{ mt: 2, pointerEvents: "auto" }}
        >
          {message}
        </Alert>
      </Slide>
    </Box>
  );
}
