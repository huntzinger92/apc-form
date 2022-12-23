import {
  primaryBlue,
  primaryBlueHover,
  secondaryTextColor,
} from "./globalStyles";

export const appContainerTextAlign = {
  textAlign: "center" as "center",
};

export const loginContainer = {
  marginTop: "20px",
  marginBottom: "20px",
  display: "flex",
  gap: "15px",
  alignItems: "center",
  justifyContent: "center",
};

export const buttonNoTextTransform = {
  ...secondaryTextColor,
  textTransform: "none" as "none",
  backgroundColor: primaryBlue,
  ":hover": {
    backgroundColor: primaryBlueHover,
  },
};

export const eventFormsContainer = {
  width: "80%",
  margin: "auto",
  display: "flex",
  flexDirection: "column" as "column",
  gap: "20px",
  marginTop: "25px",
};

export const queryEventsByDateContainer = {
  display: "flex",
  flexDirection: "column" as "column",
  gap: "15px",
  maxWidth: "200px",
  margin: "auto",
};

export const dateInput = { maxWidth: "300px" };
