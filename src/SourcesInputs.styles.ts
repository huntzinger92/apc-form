import { primaryTextColor } from "./globalStyles";

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
  ...primaryTextColor,
};

export const inputStyle = {
  width: "300px",
};
