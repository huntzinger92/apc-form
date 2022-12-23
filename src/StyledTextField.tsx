import TextField, { TextFieldProps } from "@mui/material/TextField";

export const StyledTextField = (props: TextFieldProps) => {
  let sx = {
    input: { color: "white" },
    textarea: { color: "white" },
    label: { color: "white" },
    fieldset: { borderColor: "white" },
    "& label.Mui-focused": {
      color: "#648CD1",
    },
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: "#648CD1",
      },
      "&:hover fieldset": {
        borderColor: "#86A5D9",
      },
    },
  };
  if (props.sx) {
    sx = { ...sx, ...props.sx };
  }
  return <TextField {...props} sx={sx} />;
};
