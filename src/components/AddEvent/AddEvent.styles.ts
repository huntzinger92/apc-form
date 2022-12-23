export const addIconWrapper = {
  width: "100%",
  display: "flex",
  justifyContent: "flex-start",
};

export const addIconStyle = { cursor: "pointer" };

export const addButtonStyle = {
  margin: "auto",
  marginBottom: "15px",
};

export const addTierFormWrapper = (showAddForm: boolean) => ({
  display: !showAddForm ? "none" : "inherit",
  marginBottom: "15px",
});
