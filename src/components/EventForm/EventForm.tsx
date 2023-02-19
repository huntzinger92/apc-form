import Checkbox from "@mui/material/Checkbox";
import EditIcon from "@mui/icons-material/Edit";
import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import AutoComplete from "@mui/material/Autocomplete";
import { ChangeEvent, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuidv4 } from "uuid";
import { stringToSlug } from "../../stringToSlug";
import { supabase } from "../../supabaseClient";
import { IEvent } from "../../types";
import * as styles from "./EventForm.styles";
import { SourcesInputs } from "../SourcesInputs/SourcesInputs";
import { StyledTextField } from "../StyledTextField/StyledTextField";
import { primaryTextColor } from "../../globalStyles";
import { getDefaultDate } from "./EventForm.utils";
import { Footer } from "./Footer";
import { ResponsiveInputsContainer } from "./ResponsiveInputsContainer";
import { allTags } from "./constants";

export const EventForm = ({
  collapseAddForm,
  dayEvent,
  fetchEvents,
}: {
  fetchEvents: () => void;
  dayEvent?: IEvent;
  collapseAddForm?: () => void;
}) => {
  const isEditMode = !!dayEvent;
  const {
    id = uuidv4(),
    title = "",
    otd = "",
    date = getDefaultDate(),
    links = [],
    imgSrc = "",
    imgAltText = "",
    description = "",
    NSFW = false,
    tags = [],
  } = dayEvent ?? {};

  const [loading, setLoading] = useState<boolean>(false);
  // form state hooks
  const [newTitle, setNewTitle] = useState(title);
  const [newDate, setNewDate] = useState(date);
  const [newTags, setNewTags] = useState(tags);
  const [newOtd, setNewOtd] = useState(otd);
  const [newImgSrc, setNewImgSrc] = useState(imgSrc);
  const [newImgAltText, setNewImgAltText] = useState<string>(imgAltText);
  const [newNSFW, setNewNSFW] = useState<boolean>(!!NSFW);
  const [newDescription, setNewDescription] = useState(description);
  const [newLinks, setNewLinks] = useState<string[]>(links);

  const tableName = process.env.REACT_APP_SUPABASE_TABLE_NAME as string;

  const handleNewDate = (e: ChangeEvent<HTMLInputElement>) => {
    let [newYear, newMonth, newDay] = e.target.value.split("-");
    if (newMonth[0] === "0") {
      newMonth = newMonth.slice(1);
    }
    if (newDay[0] === "0") {
      newDay = newDay.slice(1);
    }
    setNewDate(`${newMonth}/${newDay}/${newYear}`);
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (isEditMode) {
      handleEdit();
    } else {
      handleAdd();
    }
  };

  const handleEdit = async () => {
    const { error } = await supabase
      .from(tableName)
      .update({
        title: newTitle,
        slugTitle: stringToSlug(newTitle),
        date: newDate,
        tags: newTags,
        otd: newOtd,
        imgSrc: newImgSrc,
        imgAltText: newImgAltText,
        NSFW: newNSFW,
        description: newDescription,
        links: newLinks,
      })
      .eq("id", id);
    if (error) {
      toast.error(`Error while attempting to update event: ${error.message}`, {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else {
      fetchEvents();
      toast.success("Event successfully updated!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
    setLoading(false);
  };

  const handleAdd = async () => {
    const { error } = await supabase.from(tableName).insert({
      id,
      title: newTitle,
      slugTitle: stringToSlug(newTitle),
      date: newDate,
      tags: newTags,
      otd: newOtd,
      imgSrc: newImgSrc,
      imgAltText: newImgAltText,
      NSFW: newNSFW,
      description: newDescription,
      links: newLinks,
    });
    if (error) {
      toast.error(`Error while attempting to add event: ${error.message}`, {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else {
      toast.success("Event successfully added!", {
        position: toast.POSITION.TOP_RIGHT,
      });
      fetchEvents();
      collapseAddForm?.();
    }
    setLoading(false);
  };

  const formattedDate = new Date(newDate).toLocaleDateString("en-CA");

  const otdValid =
    newOtd && newOtd.match(/on this day/i) && newOtd.length < 246;
  const formValid = Boolean(
    otdValid && links[0] && newTitle && newDate && newDescription
  );

  return (
    <Accordion sx={styles.accordionBackgroundColor}>
      <AccordionSummary>
        <div style={styles.accordionHeaderStyle}>
          <Typography>{title || "New Event"}</Typography>
          <EditIcon sx={styles.discardEventIcon} />
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <div style={styles.formContainer}>
          <ResponsiveInputsContainer>
            <StyledTextField
              required
              error={!newTitle}
              label="Title"
              placeholder="Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <StyledTextField
              required
              error={!newDate}
              label="Date"
              placeholder="Date"
              type="date"
              value={formattedDate}
              onChange={handleNewDate}
            />
            <AutoComplete
              multiple
              id="tags"
              options={allTags}
              getOptionLabel={(option: string) => option}
              value={newTags}
              onChange={(_, value) => setNewTags(value)}
              renderInput={(params) => (
                <StyledTextField
                  {...params}
                  variant="outlined"
                  label="Event Tags"
                />
              )}
            />
            <StyledTextField
              label="Image Source (storage reference)"
              placeholder="Event/someImg.jpg"
              value={newImgSrc}
              onChange={(e) => setNewImgSrc(e.target.value)}
            />
            <StyledTextField
              multiline
              label="Image Caption"
              placeholder="Image Caption"
              value={newImgAltText}
              onChange={(e) => setNewImgAltText(e.target.value)}
              fullWidth
            />
            <FormControlLabel
              control={<Checkbox checked={newNSFW} sx={primaryTextColor} />}
              label="NSFW"
              onChange={() => setNewNSFW(!newNSFW)}
            />
          </ResponsiveInputsContainer>
          <StyledTextField
            required
            multiline
            error={!otdValid}
            label="On this day statement (social media title)"
            placeholder="On this day..."
            value={newOtd}
            onChange={(e) => setNewOtd(e.target.value)}
            fullWidth
          />
          <StyledTextField
            required
            multiline
            error={!newDescription}
            label="Description"
            placeholder="Description"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            rows={9}
          />
          <SourcesInputs
            setNewSources={setNewLinks}
            newSources={newLinks}
            originalSources={links}
          />
          <Footer
            id={id}
            isEditMode={isEditMode}
            formValid={formValid}
            loading={loading}
            collapseAddForm={collapseAddForm}
            handleSubmit={handleSubmit}
            fetchEvents={fetchEvents}
          />
        </div>
      </AccordionDetails>
    </Accordion>
  );
};
