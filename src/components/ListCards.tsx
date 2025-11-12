import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Divider,
} from "@mui/material";
import type { List } from "../types/listsType";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function ListCards({
  data,
  deleteClick,
}: {
  data: List;
  deleteClick: (name: string, listId: string) => void;
}) {
  function dateCustomFormatting(date: Date): string {
    const padStart = (value: number): string =>
      value.toString().padStart(2, "0");
    return `${padStart(date.getDate())}/${padStart(
      date.getMonth() + 1
    )}/${date.getFullYear()} ${padStart(date.getHours())}:${padStart(
      date.getMinutes()
    )}`;
  }

  return (
    <Card sx={{ my: 2 }}>
      <CardContent
        sx={{
          width: "65vw",
          background: "#308dda11",
          "&:last-child": { paddingBottom: 2 },
        }}
      >
        <Typography
          sx={{ wordBreak: "break-all" }}
          textAlign="center"
          variant="body1"
          color="initial"
        >
          {data.name}
        </Typography>

        <Typography textAlign="center" variant="body2" color="info">
          {dateCustomFormatting(data.createdAt)}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Box display="flex" justifyContent="space-between">
          <Button id="edit" size="small" variant="contained" color="primary">
            <EditIcon fontSize="small" />
          </Button>
          <Button
            id="delete"
            size="small"
            variant="contained"
            color="error"
            onClick={() => deleteClick(data.name, data.id)}
          >
            <DeleteIcon fontSize="small" />
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
