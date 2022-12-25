import { StyledButton } from "../StyledButton/StyledButton";
import { DeleteButton } from "./DeleteButton";
import * as styles from "./EventForm.styles";

export interface IFooterProps {
  isEditMode: boolean;
  loading: boolean;
  formValid: boolean;
  id: string;
  collapseAddForm?: () => void;
  handleSubmit: () => void;
  fetchEvents: () => void;
}

export const Footer = ({
  id,
  isEditMode,
  formValid,
  loading,
  collapseAddForm,
  handleSubmit,
  fetchEvents,
}: IFooterProps) => {
  return (
    <div>
      <StyledButton
        variant="contained"
        sx={styles.buttonStyle}
        onClick={handleSubmit}
        disabled={!formValid || loading}
        type="button"
      >
        {`${isEditMode ? "Update" : "Save"}`}
      </StyledButton>
      {!isEditMode && (
        <StyledButton
          variant="contained"
          sx={styles.rightButtonStyle}
          onClick={collapseAddForm}
          disabled={loading}
          type="button"
        >
          Discard
        </StyledButton>
      )}
      {isEditMode && (
        <DeleteButton id={id} loading={loading} fetchEvents={fetchEvents} />
      )}
    </div>
  );
};
