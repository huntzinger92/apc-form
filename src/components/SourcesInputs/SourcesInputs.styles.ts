import { primaryBlueHover, primaryTextColor } from "../../globalStyles";

export const sourceInputsContainer = {
  display: "flex",
  gap: "15px",
  flexWrap: "wrap" as "wrap",
};

export const inputRow = {
  display: "flex",
  gap: "10px",
  alignItems: "center",
};

export const sourcesHeader = {
  ...primaryTextColor,
  marginBottom: "15px",
};

export const iconStyle = {
  cursor: "pointer" as "pointer",
  transition: "color 250ms",
  ":hover": {
    color: primaryBlueHover,
  },
  ...primaryTextColor,
};

export const addIconStyle = (makeIconRed: boolean) => ({
  cursor: "pointer" as "pointer",
  transition: "color 250ms",
  ":hover": {
    color: primaryBlueHover,
  },
  color: makeIconRed ? "red" : primaryTextColor.color,
});
