import "./App.css";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { supabase } from "./supabaseClient";
import { ChangeEvent, useEffect, useState } from "react";
import { EventForm } from "./EventForm";
import { IEvent } from "./types";
import { AddEvent } from "./AddEvent";

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
    <div className="App">
      <div
        style={{
          marginTop: "20px",
          marginBottom: "20px",
          display: "flex",
          gap: "15px",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TextField
          label="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button style={{ textTransform: "none" }} onClick={handleLogin}>
          Login
        </Button>
      </div>
      <TextField
        label="Date"
        type="date"
        defaultValue={defaultDate}
        onChange={handleNewDate}
      />
      <div
        style={{
          width: "80%",
          margin: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <AddEvent />
        {dayEvents.map((dayEvent) => (
          <EventForm dayEvent={dayEvent} key={dayEvent.id} />
        ))}
      </div>
    </div>
  );
}

export default App;
