import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { EventForm } from "../EventForm/EventForm";
import { StyledTextField } from "../StyledTextField/StyledTextField";
import { supabase } from "../../supabaseClient";
import { IEvent } from "../../types";
import * as styles from "./EventsByDate.styles";
import { AddEvent } from "../AddEvent/AddEvent";

interface IDate {
  month: string;
  day: string;
}

export const EventsByDate = () => {
  const defaultDate = new Date().toLocaleDateString("en-CA");
  const [, newMonth, newDay] = defaultDate.split("-");

  const [date, setDate] = useState<IDate>({
    month: newMonth,
    day: newDay,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [dayEvents, setDayEvents] = useState<IEvent[]>([]);

  const fetchEvents = useCallback(async () => {
    const { month, day } = date;
    setLoading(true);
    const { data: newDayEvents, error } = await supabase
      .from("eventLibrary_test")
      .select()
      // mm/dd/ format
      .like("date", `%${month}/${day}/%`);
    const sortedEvents = newDayEvents?.sort((first, second) =>
      first.title < second.title ? -1 : 1
    );
    setDayEvents(sortedEvents ?? []);
    setLoading(false);
    if (error) {
      toast.error(`Error while fetching events: ${error.message}`);
    }
  }, [date]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleNewDate = (e: ChangeEvent<HTMLInputElement>) => {
    const [, newMonth, newDay] = e.target.value.split("-");
    setDate({
      month: newMonth,
      day: newDay,
    });
  };

  return (
    <div>
      <div style={styles.queryEventsByDateContainer}>
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
          <EventForm
            dayEvent={dayEvent}
            key={dayEvent.id}
            fetchEvents={fetchEvents}
          />
        ))}
        {dayEvents.length === 0 && (
          <Typography variant="h6">No events found!</Typography>
        )}
        <AddEvent fetchEvents={fetchEvents} />
        {loading && (
          <span data-testid="loading-spinner">
            <CircularProgress sx={styles.loadingSpinner} />
          </span>
        )}
      </div>
    </div>
  );
};
