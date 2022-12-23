import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { StyledButton } from "../StyledButton/StyledButton";
import { StyledTextField } from "../StyledTextField";
import { supabase } from "../supabaseClient";
import * as styles from "./Login.styles";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email: username,
      password,
    });
    error
      ? toast.error(`Error while logging in: ${error.message}`, {
          position: toast.POSITION.TOP_RIGHT,
        })
      : toast.success("Successfully logged in!", {
          position: toast.POSITION.TOP_RIGHT,
        });
  };
  return (
    <div style={styles.loginContainer}>
      <ToastContainer autoClose={4000} />
      <StyledTextField
        label="Username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <StyledTextField
        label="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <StyledButton variant="contained" onClick={handleLogin}>
        Login
      </StyledButton>
    </div>
  );
};
