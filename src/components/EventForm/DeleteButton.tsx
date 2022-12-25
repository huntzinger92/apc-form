import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { StyledButton } from "../StyledButton/StyledButton";
import { supabase } from "../../supabaseClient";
import * as styles from "./EventForm.styles";

export interface IDeleteButtonProps {
  id: string;
  loading: boolean;
  fetchEvents: () => void;
}

export const DeleteButton = ({
  id,
  loading,
  fetchEvents,
}: IDeleteButtonProps) => {
  const [open, setOpen] = useState<boolean>(false);

  const tablename = "eventLibrary_test";
  const handleDelete = async () => {
    const { error } = await supabase.from(tablename).delete().eq("id", id);
    handleClose();
    if (error) {
      toast.error(`Error while attempting to delete event: ${error.message}`, {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else {
      toast.success("Successfully deleted event!", {
        position: toast.POSITION.TOP_RIGHT,
      });
      fetchEvents();
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Dialog open={open}>
        <DialogContent>
          <Typography>
            This action cannot be undone. Are you sure you want to delete this
            event?
          </Typography>
          <div
            style={styles.deleteModalButtonsStyle}
            data-testid="delete-modal-buttons"
          >
            <StyledButton variant="contained" onClick={handleDelete}>
              Delete
            </StyledButton>
            <StyledButton variant="contained" onClick={handleClose}>
              Cancel
            </StyledButton>
          </div>
        </DialogContent>
      </Dialog>
      <StyledButton
        variant="contained"
        sx={styles.rightButtonStyle}
        onClick={handleOpen}
        type="button"
        disabled={loading}
      >
        Delete
      </StyledButton>
    </>
  );
};
