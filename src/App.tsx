import "./App.css";
import { supabase } from "./supabaseClient";
import { ChangeEvent, useState } from "react";
import { EventForm } from "./EventForm";
import { IEvent } from "./types";

function App() {
  const [dayEvents, setDayEvents] = useState<IEvent[]>([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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
      <input onChange={(e) => setUsername(e.target.value)} />
      <input onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>login</button>
      <div>
        <div>
          <p>date</p>
          <input type="date" onChange={handleNewDate} />
        </div>
      </div>
      <div style={{ width: "70%", margin: "auto" }}>
        {dayEvents.map((dayEvent) => (
          <EventForm dayEvent={dayEvent} key={dayEvent.id} />
        ))}
      </div>
    </div>
  );
}

export default App;
