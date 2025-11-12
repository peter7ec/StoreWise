import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import NewListModal from "../components/NewListModal";
import type { SeverityType } from "../components/TopAlert";
import TopAlert from "../components/TopAlert";
import { useAuth } from "../services/authContext";
import getListData from "../services/getListData";
import type { List } from "../types/listsType";

export default function ListsPage() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [popUpMessage, setPopUpMessage] = useState<string>();
  const [popUpSeverity, setPopUpSeverity] = useState<SeverityType>();
  const [listData, setListData] = useState<List[]>([]);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  useEffect(() => {
    const fetchListData = async () => {
      if (user?.uid) {
        try {
          const fetchedData = await getListData(user.uid);

          if (fetchedData) {
            setListData(fetchedData);
            console.log(fetchedData);
          }
        } catch (error) {
          setPopUpMessage("");
          setPopUpMessage("Még nem hozottlétre listákat!");
          setPopUpSeverity("info");
          console.error("Hiba történt a listaadatok lekérésekor:", error);
        }
      }
    };
    fetchListData();
  }, [user]);

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
