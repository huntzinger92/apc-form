import {
  primaryBlueHover,
  primaryTextColor,
  secondaryBlack,
} from "../../globalStyles";

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
  width: "115px",
  margin: "auto",
  marginBottom: "15px",
};

export const rightButtonStyle = {
  ...buttonStyle,
  marginLeft: "15px",
};

export const accordionHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
};

export const accordionBackgroundColor = {
  backgroundColor: secondaryBlack,
  width: "100%",
  ...primaryTextColor,
};

export const discardEventIcon = {
  transition: "color 250ms",
  ":hover": {
    color: primaryBlueHover,
  },
};

export const deleteModalButtonsStyle = {
  display: "flex",
  justifyContent: "flex-start",
  marginTop: "15px",
  gap: "15px",
};
