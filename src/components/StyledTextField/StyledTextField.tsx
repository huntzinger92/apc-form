import TextField, { TextFieldProps } from "@mui/material/TextField";
import {
  primaryBlue,
  primaryBlueHover,
  primaryTextColor,
} from "../../globalStyles";
import "./styledTextField.css";

export const StyledTextField = (props: TextFieldProps) => {
  let sx = {
    input: primaryTextColor,
    textarea: primaryTextColor,
    label: primaryTextColor,
    fieldset: { borderColor: "white" },
    "& label.Mui-focused": {
      color: primaryBlueHover,
    },
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: primaryBlueHover,
      },
      "&:hover fieldset": {
        borderColor: primaryBlue,
      },
    },
    "& .MuiChip-label": {
      color: primaryTextColor,
    },
    "& .MuiChip-deleteIcon": {
      color: primaryTextColor,
    },
    "& .MuiSvgIcon-root": {
      color: primaryTextColor,
    },
  };
  if (props.sx) {
    sx = { ...sx, ...props.sx };
  }
  return <TextField {...props} sx={sx} />;
};
