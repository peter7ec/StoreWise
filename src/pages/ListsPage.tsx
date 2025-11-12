import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import NewListModal from "../components/NewListModal";
import type { SeverityType } from "../components/TopAlert";
import TopAlert from "../components/TopAlert";

export default function ListsPage() {
  /* const { user } = useAuth(); */
  /* const navigate = useNavigate(); */
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);
  const [popUpMessage, setPopUpMessage] = useState<string>();
  const [popUpSeverity, setPopUpSeverity] = useState<SeverityType>();

  return (
    <Container maxWidth="xl">
      <Typography
        variant="h1"
        color="initial"
        sx={{ fontSize: 20, mb: 2, textAlign: { xs: "center", md: "left" } }}
      >
        Listák
      </Typography>
      <Container
        maxWidth="lg"
        sx={{ display: "flex", alignItems: "center", flexDirection: "column" }}
      >
        <Button
          onClick={handleOpen}
          fullWidth
          variant="contained"
          color="primary"
        >
          Új lista
        </Button>
        {isOpen && (
          <NewListModal
            handleClose={handleClose}
            handleOpen={handleOpen}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            setPopUpMessage={setPopUpMessage}
            setPopUpSeverity={setPopUpSeverity}
          ></NewListModal>
        )}
        {popUpMessage && (
          <TopAlert
            message={popUpMessage}
            severity={popUpSeverity || "error"}
          />
        )}
      </Container>
    </Container>
  );
}
