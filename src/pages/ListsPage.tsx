import { useNavigate } from "react-router";
import { useAuth } from "../services/authContext";

export default function ListsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return <div>ListsPage</div>;
}
