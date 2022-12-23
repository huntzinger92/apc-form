export const addIconWrapper = {
  width: "100%",
  display: "flex",
  justifyContent: "flex-start",
};

export const addIconStyle = { cursor: "pointer" };

export const addButtonStyle = {
  textTransform: "none" as "none",
  cursor: "pointer",
  backgroundColor: "#86A5D9",
  ":hover": {
    backgroundColor: "#648CD1",
  },
  color: "#1c1c1c",
  margin: "auto",
  marginBottom: "15px",
};

export const addTierFormWrapper = (showAddForm: boolean) => ({
  display: !showAddForm ? "none" : "inherit",
  marginBottom: "15px",
});
