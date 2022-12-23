import {
  primaryBlue,
  primaryBlueHover,
  secondaryTextColor,
} from "./globalStyles";

export const addIconWrapper = {
  width: "100%",
  display: "flex",
  justifyContent: "flex-start",
};

export const addIconStyle = { cursor: "pointer" };

export const addButtonStyle = {
  ...secondaryTextColor,
  textTransform: "none" as "none",
  cursor: "pointer",
  backgroundColor: primaryBlue,
  ":hover": {
    backgroundColor: primaryBlueHover,
  },
  margin: "auto",
  marginBottom: "15px",
};

export const addTierFormWrapper = (showAddForm: boolean) => ({
  display: !showAddForm ? "none" : "inherit",
  marginBottom: "15px",
});
