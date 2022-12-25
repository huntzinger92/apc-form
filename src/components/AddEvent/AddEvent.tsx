import { useState } from "react";
import { EventForm } from "../EventForm/EventForm";
import * as styles from "./AddEvent.styles";
import { StyledButton } from "../StyledButton/StyledButton";

export const AddEvent = () => {
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  const collapseAddForm = () => {
    setShowAddForm(false);
  };

  return (
    <div style={styles.addEventsContainer}>
      {!showAddForm && (
        <div style={styles.addIconWrapper}>
          <StyledButton
            sx={styles.addButtonStyle}
            variant="contained"
            onClick={() => setShowAddForm(true)}
          >
            Add New Event
          </StyledButton>
        </div>
      )}
      <div style={styles.addTierFormWrapper(showAddForm)}>
        <EventForm collapseAddForm={collapseAddForm} />
      </div>
    </div>
  );
};
