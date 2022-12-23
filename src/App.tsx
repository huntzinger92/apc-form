import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { supabase } from "./supabaseClient";
import { ChangeEvent, useEffect, useState } from "react";
import { EventForm } from "./EventForm";
import { IEvent } from "./types";
import { AddEvent } from "./AddEvent";
import * as styles from "./App.styles";
import { StyledTextField } from "./StyledTextField";

function App() {
  const [dayEvents, setDayEvents] = useState<IEvent[]>([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const defaultDate = new Date().toLocaleDateString("en-CA");

  useEffect(() => {
    const [, newMonth, newDay] = defaultDate.split("-");
    fetchEvents(newMonth, newDay);
  }, [defaultDate]);

  const handleNewDate = (e: ChangeEvent<HTMLInputElement>) => {
    const [, newMonth, newDay] = e.target.value.split("-");
    fetchEvents(newMonth, newDay);
  };

  const fetchEvents = async (month: string, day: string) => {
    const { data: newDayEvents } = await supabase
      .from("eventLibrary_test")
      .select()
      // MM/YY/ format
      .like("date", `%${month}/${day}/%`);
    setDayEvents(newDayEvents ?? []);
  };

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email: username,
      password,
    });
    alert(error ? error.message : "successfully logged in");
  };

  return (
    <div style={styles.appContainerTextAlign}>
      <div style={styles.loginContainer}>
        <StyledTextField
          label="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <StyledTextField
          label="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          variant="contained"
          sx={styles.buttonNoTextTransform}
          onClick={handleLogin}
        >
          Login
        </Button>
      </div>
      <div style={styles.eventFormsContainer}>
        <AddEvent />
      </div>
      <div style={styles.queryEventsByDateContainer}>
        <Typography variant="h6">Query Existing Events</Typography>
        <StyledTextField
          label="Date"
          type="date"
          defaultValue={defaultDate}
          onChange={handleNewDate}
          sx={styles.dateInput}
        />
      </div>
      <div style={styles.eventFormsContainer}>
        {dayEvents.map((dayEvent) => (
          <EventForm dayEvent={dayEvent} key={dayEvent.id} />
        ))}
      </div>
    </div>
  );
}

export default App;
