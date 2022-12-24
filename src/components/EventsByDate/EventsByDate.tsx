import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { EventForm } from "../EventForm/EventForm";
import { StyledTextField } from "../../StyledTextField";
import { supabase } from "../../supabaseClient";
import { IEvent } from "../../types";
import * as styles from "./EventsByDate.styles";

export const EventsByDate = () => {
  const [loading, setLoading] = useState<boolean>(false);
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
    setLoading(true);
    const { data: newDayEvents, error } = await supabase
      .from("eventLibrary_test")
      .select()
      // mm/dd/ format
      .like("date", `%${month}/${day}/%`);
    setDayEvents(newDayEvents ?? []);
    setLoading(false);
    if (error) {
      toast.error(`Error while fetching events: ${error.message}`);
    }
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
        {dayEvents.length === 0 && (
          <Typography variant="h6">No events found!</Typography>
        )}
        {loading && (
          <span data-testid="loading-spinner">
            <CircularProgress sx={styles.loadingSpinner} />
          </span>
        )}
      </div>
    </div>
  );
};
