import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { Route, Routes, useNavigate } from "react-router-dom";
import * as styles from "./App.styles";
import { Login } from "../Login/Login";
import { EventsByDate } from "../EventsByDate/EventsByDate";
import { supabase } from "../../supabaseClient";
import { useCallback, useEffect, useState } from "react";

function App() {
  const [loading, setLoading] = useState<boolean>(true);

  const navigate = useNavigate();

  const checkUserAuthentication = useCallback(async () => {
    const { data } = await supabase.auth.getUser();
    setLoading(false);
    const hasAuthentication = !!data?.user;
    if (!hasAuthentication) {
      navigate("login");
    }
  }, [navigate]);

  useEffect(() => {
    checkUserAuthentication();
  }, [checkUserAuthentication]);

  return (
    <div style={styles.appContainerTextAlign}>
      <Typography variant="h3" sx={styles.headerStyle}>
        aPC Events Updater 9000
      </Typography>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <div style={styles.appFormContainer}>
              {loading && (
                <span data-testid="auth-loading-spinner">
                  <CircularProgress sx={styles.loginLoadingSpinner} />
                </span>
              )}
              {!loading && <EventsByDate />}
            </div>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
