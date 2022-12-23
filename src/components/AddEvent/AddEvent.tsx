import { useState } from "react";
import { EventForm } from "../EventForm/EventForm";
import * as styles from "./AddEvent.styles";
import { StyledButton } from "../StyledButton/StyledButton";
import { eventFormsContainer } from "../EventsByDate/EventsByDate.styles";

export const AddEvent = () => {
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  const collapseAddForm = () => {
    setShowAddForm(false);
  };

  return (
    <div style={eventFormsContainer}>
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