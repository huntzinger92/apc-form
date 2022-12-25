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

const getNonZeroPaddedMonthDayFromDateString = (dateString: string) => {
  let [, month, day] = dateString.split("-");
  if (month[0] === "0") {
    month = month.slice(1);
  }
  if (day[0] === "0") {
    day = day.slice(1);
  }
  return { month, day };
};

export const EventsByDate = () => {
  const defaultDate = new Date().toLocaleDateString("en-CA");
  const monthAndDate = getNonZeroPaddedMonthDayFromDateString(defaultDate);
  const tableName = process.env.REACT_APP_SUPABASE_TABLE_NAME as string;

  const [date, setDate] = useState<IDate>(monthAndDate);
  const [loading, setLoading] = useState<boolean>(false);
  const [dayEvents, setDayEvents] = useState<IEvent[]>([]);

  const fetchEvents = useCallback(async () => {
    const { month, day } = date;
    setLoading(true);
    const { data: newDayEvents, error } = await supabase
      .from(tableName)
      .select()
      // mm/dd/ format
      .like("date", `${month}/${day}/%`);
    const sortedEvents = newDayEvents?.sort((first, second) =>
      first.title < second.title ? -1 : 1
    );
    setDayEvents(sortedEvents ?? []);
    setLoading(false);
    if (error) {
      toast.error(`Error while fetching events: ${error.message}`);
    }
  }, [date, tableName]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleNewDate = (e: ChangeEvent<HTMLInputElement>) => {
    // if invalid date input
    if (!e.target.value) {
      return;
    }
    const formattedMonthAndDate = getNonZeroPaddedMonthDayFromDateString(
      e.target.value
    );
    setDate(formattedMonthAndDate);
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
        {loading && (
          <span data-testid="loading-spinner">
            <CircularProgress sx={styles.loadingSpinner} />
          </span>
        )}
        {!loading && (
          <>
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
          </>
        )}
      </div>
    </div>
  );
};
