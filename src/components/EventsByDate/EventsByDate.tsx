import Typography from "@mui/material/Typography";
import { ChangeEvent, useEffect, useState } from "react";
import { EventForm } from "../EventForm/EventForm";
import { StyledTextField } from "../../StyledTextField";
import { supabase } from "../../supabaseClient";
import { IEvent } from "../../types";
import * as styles from "./EventsByDate.styles";

export const EventsByDate = () => {
  const [dayEvents, setDayEvents] = useState<IEvent[]>([]);

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
  return (
    <div>
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
};
