import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { EventForm } from "./EventForm";

export const AddEvent = () => {
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  const collapseAddForm = () => {
    setShowAddForm(false);
  };

  return showAddForm ? (
    <EventForm collapseAddForm={collapseAddForm} />
  ) : (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      <AddIcon
        style={{ cursor: "pointer" }}
        onClick={() => setShowAddForm(true)}
      />
    </div>
  );
};
