import { zodResolver } from "@hookform/resolvers/zod";
import { Box, FormLabel, Modal, TextField, Button } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import { type SeverityType } from "./TopAlert";
import type { List } from "../types/listsType";
import { updateList } from "../services/updateList";
import { editListScehem, type EditList } from "../services/editListScheme";

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

export default function EditListModal({
  isOpen,
  targetData,
  handleClose,
  setPopUpMessage,
  setPopUpSeverity,
  setListsData,
}: {
  isOpen: boolean;
  targetData: List;
  handleClose: () => void;
  setPopUpMessage: React.Dispatch<React.SetStateAction<string | undefined>>;
  setPopUpSeverity: React.Dispatch<
    React.SetStateAction<SeverityType | undefined>
  >;
  setListsData: React.Dispatch<React.SetStateAction<List[]>>;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditList>({
    resolver: zodResolver(editListScehem),
  });

  const onSubmit = async (data: EditList) => {
    setPopUpMessage("");
    setPopUpSeverity("success");

    try {
      await updateList(targetData.id, data.editedData);
      setPopUpMessage("Lista sikeresen létrehozva!");
      setListsData((currentData) => {
        return currentData.map((list) => {
          if (list.id === targetData.id) {
            return { ...list, name: data.editedData };
          } else {
            return list;
          }
        });
      });
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
            <FormLabel sx={{ mb: 2 }}>Lista név módosítás</FormLabel>
            <TextField
              required
              id="list-name"
              error={!!errors.editedData}
              label="Lista neve"
              defaultValue={targetData.name}
              {...register("editedData")}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ my: 2 }}
            >
              Módosítás
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
