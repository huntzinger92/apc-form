import Button, { ButtonProps } from "@mui/material/Button";
import {
  primaryBlue,
  primaryBlueDisabled,
  primaryBlueHover,
  secondaryTextColor,
} from ".././globalStyles";

export const StyledButton = (props: ButtonProps) => {
  let sx = {
    ...secondaryTextColor,
    textTransform: "none" as "none",
    backgroundColor: primaryBlue,
    ":hover": {
      backgroundColor: primaryBlueHover,
    },
    "&.Mui-disabled": {
      backgroundColor: primaryBlueDisabled,
    },
    cursor: "pointer",
  };
  if (props.sx) {
    // @ts-ignore-next-line
    sx = { ...sx, ...props.sx };
  }
  return <Button {...props} sx={sx} />;
};
