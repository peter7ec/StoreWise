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
import ListCards from "../components/ListCards";
import { deleteList } from "../services/deleteList";
import EditListModal from "../components/EditListModal";

export default function ListsPage() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [popUpMessage, setPopUpMessage] = useState<string>();
  const [popUpSeverity, setPopUpSeverity] = useState<SeverityType>();
  const [listData, setListData] = useState<List[]>([]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [listToEdit, setListToEdit] = useState<List | null>(null);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleOpenEditModal = (list: List) => {
    setListToEdit(list);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setListToEdit(null);
  };

  const handleDeleteClick = (name: string, listId: string) => {
    if (
      window.confirm(`Biztosan törölni szeretnéd a(z) "${name}" nevű listát?`)
    ) {
      deleteList(listId);
      setPopUpMessage("");
      setListData(listData.filter((list) => list.id != listId));
      setPopUpMessage("Sikeresen törölve!");
      setPopUpSeverity("success");
    }
  };

  useEffect(() => {
    const fetchListData = async () => {
      if (user?.uid) {
        try {
          const fetchedData = await getListData(user.uid);

          if (fetchedData) {
            setListData(fetchedData);
            if (fetchedData.length == 0) {
              setPopUpMessage("");
              setPopUpMessage("Még nem hozottlétre listákat!");
              setPopUpSeverity("warning");
            }
          }
        } catch (error) {
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
        maxWidth="xl"
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          p: 0,
        }}
      >
        <Button
          onClick={handleOpen}
          fullWidth
          variant="contained"
          color="primary"
          sx={{
            width: "65vw",
          }}
        >
          Új lista
        </Button>
        {isOpen && (
          <NewListModal
            handleClose={handleClose}
            handleOpen={handleOpen}
            setListsData={setListData}
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
        {listData.map((list) => (
          <ListCards
            key={list.id}
            data={list}
            deleteClick={handleDeleteClick}
            editClick={handleOpenEditModal}
          />
        ))}
        {isEditModalOpen && listToEdit && (
          <EditListModal
            isOpen={isEditModalOpen}
            handleClose={handleCloseEditModal}
            targetData={listToEdit}
            setListsData={setListData}
            setPopUpMessage={setPopUpMessage}
            setPopUpSeverity={setPopUpSeverity}
          />
        )}
      </Container>
    </Container>
  );
}
