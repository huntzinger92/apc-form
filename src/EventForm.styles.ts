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
  textTransform: "none" as "none",
  width: "115px",
  margin: "auto",
  marginBottom: "15px",
  backgroundColor: "#86A5D9",
  ":hover": {
    backgroundColor: "#648CD1",
  },
  "&.Mui-disabled": {
    backgroundColor: "#7893C2",
  },
  color: "#1c1c1c",
  cursor: "pointer",
};

export const deleteButtonStyle = {
  ...buttonStyle,
  marginLeft: "15px",
};

export const textColor = {
  color: "white",
};

export const accordionHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
  ...textColor,
};

export const accordionBackgroundColor = { backgroundColor: "#403c56" };
