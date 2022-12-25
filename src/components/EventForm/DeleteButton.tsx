import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { StyledButton } from "../StyledButton/StyledButton";
import { supabase } from "../../supabaseClient";
import * as styles from "./EventForm.styles";

export interface IDeleteButtonProps {
  id: string;
  loading: boolean;
}

export const DeleteButton = ({ id, loading }: IDeleteButtonProps) => {
  const tablename = "eventLibrary_test";
  const handleDelete = async () => {
    const { error } = await supabase.from(tablename).delete().eq("id", id);
    error
      ? toast.error(
          `Error while attempting to delete event: ${error.message}`,
          {
            position: toast.POSITION.TOP_RIGHT,
          }
        )
      : toast.success("Successfully deleted event!", {
          position: toast.POSITION.TOP_RIGHT,
        });
  };

  return (
    <StyledButton
      variant="contained"
      sx={styles.rightButtonStyle}
      onClick={handleDelete}
      type="button"
      disabled={loading}
    >
      Delete
    </StyledButton>
  );
};
