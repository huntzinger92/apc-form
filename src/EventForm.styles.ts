import {
  primaryBlue,
  primaryBlueDisabled,
  primaryBlueHover,
  primaryTextColor,
  secondaryBlue,
  secondaryTextColor,
} from "./globalStyles";

export const formContainer = {
  display: "flex",
  flexDirection: "column" as "column",
  gap: "20px",
};

export const firstFormRow = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
  gap: "15px",
};

export const secondFormRow = {
  display: "grid",
  gridTemplateColumns: "3fr 7fr 1fr",
  gap: "15px",
};

export const buttonStyle = {
  ...secondaryTextColor,
  textTransform: "none" as "none",
  width: "115px",
  margin: "auto",
  marginBottom: "15px",
  backgroundColor: primaryBlue,
  ":hover": {
    backgroundColor: primaryBlueHover,
  },
  "&.Mui-disabled": {
    backgroundColor: primaryBlueDisabled,
  },
  cursor: "pointer",
};

export const deleteButtonStyle = {
  ...buttonStyle,
  marginLeft: "15px",
};

export const accordionHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
};

export const accordionBackgroundColor = {
  backgroundColor: secondaryBlue,
  ...primaryTextColor,
};
