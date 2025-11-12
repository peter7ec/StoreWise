import { zodResolver } from "@hookform/resolvers/zod";
import { Box, FormLabel, Modal, TextField, Button } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import { type NewList, newListScehem } from "../services/newListScheme";
import { addDoc, collection } from "firebase/firestore";
import { useAuth } from "../services/authContext";
import { db } from "../services/FireBaseConfig";
import { type SeverityType } from "./TopAlert";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  bgcolor: "background.paper",
  border: "2px ",
  boxShadow: 24,
  p: 4,
};

export default function NewListModal({
  isOpen,
  handleClose,

  setPopUpMessage,

  setPopUpSeverity,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleOpen: () => void;
  handleClose: () => void;
  setPopUpMessage: React.Dispatch<React.SetStateAction<string | undefined>>;
  setPopUpSeverity: React.Dispatch<
    React.SetStateAction<SeverityType | undefined>
  >;
}) {
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewList>({
    resolver: zodResolver(newListScehem),
  });

  const onSubmit = async (data: NewList) => {
    setPopUpMessage("");
    setPopUpSeverity("success");

    try {
      await addDoc(collection(db, "lists"), {
        name: data.listName,
        createdAt: new Date(),
        userId: user?.uid,
      });
      setPopUpMessage("Lista sikeresen létrehozva!");
      handleClose();
    } catch (err) {
      setPopUpMessage(err as string);
      setPopUpSeverity("error");
    }
  };
  return (
    <div>
      <Modal
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ display: "flex", flexDirection: "column" }}
          >
            <FormLabel sx={{ mb: 2 }}>Lista létrehozás</FormLabel>
            <TextField
              required
              id="list-name"
              error={!!errors.listName}
              label="Lista neve"
              defaultValue=""
              {...register("listName")}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ my: 2 }}
            >
              Létrehozás
            </Button>
            <Button variant="text" color="primary" onClick={handleClose}>
              Mégse
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
