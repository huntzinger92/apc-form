import { useState } from "react";
import Button from "@mui/material/Button";
import { EventForm } from "./EventForm";
import * as styles from "./AddEvent.styles";

export const AddEvent = () => {
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  const collapseAddForm = () => {
    setShowAddForm(false);
  };

  return (
    <div>
      {!showAddForm && (
        <div style={styles.addIconWrapper}>
          <Button
            sx={styles.addButtonStyle}
            variant="contained"
            onClick={() => setShowAddForm(true)}
          >
            Add New Event
          </Button>
        </div>
      )}
      <div style={styles.addTierFormWrapper(showAddForm)}>
        <EventForm collapseAddForm={collapseAddForm} />
      </div>
    </div>
  );
};
