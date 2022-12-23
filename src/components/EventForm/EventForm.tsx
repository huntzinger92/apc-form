import Checkbox from "@mui/material/Checkbox";
import DeleteIcon from "@mui/icons-material/Delete";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { ChangeEvent, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuidv4 } from "uuid";
import { stringToSlug } from "../../stringToSlug";
import { supabase } from "../../supabaseClient";
import { IEvent } from "../../types";
import * as styles from "./EventForm.styles";
import { SourcesInputs } from "../../SourcesInputs";
import { StyledTextField } from "../../StyledTextField";
import { primaryTextColor } from "../../globalStyles";
import { StyledButton } from "../StyledButton/StyledButton";
import { DeleteButton } from "./DeleteIcon";
import {
  getDefaultDate,
  rawDbSourcesToArray,
  sourcesArrayToDbString,
} from "./EventForm.utils";

// cleanup - create separate components/utils, organize directories, readme, icon in browser
// tests

// apply to real eventLibrary table!

// nice to haves:
// - search by term instead of day
// - display image
// - upload image from website so you don't have to go into supabase to change image (will also have to handle displaying it)
// - deploy so you don't have to use on your laptop running

export const EventForm = ({
  dayEvent,
  collapseAddForm,
}: {
  dayEvent?: Partial<IEvent>;
  collapseAddForm?: () => void;
}) => {
  const isEditMode = !!dayEvent;
  const {
    id = uuidv4(),
    title = "",
    otd = "",
    date = getDefaultDate(),
    sources = "[]",
    imgSrc = "",
    imgAltText = "",
    description = "",
    category = "",
    NSFW = false,
  } = dayEvent ?? {};

  // sources is a stringified array, but due to current db formatting, needs single apostrophes replaced with double quotes
  const originalSources = rawDbSourcesToArray(sources);

  const [newTitle, setNewTitle] = useState(title);
  const [newDate, setNewDate] = useState(date);
  const [newCategory, setNewCategory] = useState(category);
  const [newOtd, setNewOtd] = useState(otd);
  const [newImgSrc, setNewImgSrc] = useState(imgSrc);
  const [newImgAltText, setNewImgAltText] = useState<string>(imgAltText);
  const [newNSFW, setNewNSFW] = useState<boolean>(!!NSFW);
  const [newDescription, setNewDescription] = useState(description);
  const [newSources, setNewSources] = useState<string[]>(originalSources);

  const tableName = "eventLibrary_test";

  const handleNewDate = (e: ChangeEvent<HTMLInputElement>) => {
    const [newYear, newMonth, newDay] = e.target.value.split("-");
    setNewDate(`${newMonth}/${newDay}/${newYear}`);
  };

  const handleSubmit = async () => {
    if (isEditMode) {
      handleEdit();
    } else {
      handleAdd();
    }
  };

  const handleEdit = async () => {
    const formattedSources = sourcesArrayToDbString(newSources);
    const { error } = await supabase
      .from(tableName)
      .update({
        title: newTitle,
        slugTitle: stringToSlug(newTitle),
        date: newDate,
        category: newCategory,
        otd: newOtd,
        imgSrc: newImgSrc,
        imgAltText: newImgAltText,
        NSFW: newNSFW,
        description: newDescription,
        sources: formattedSources,
      })
      .eq("id", id);
    error
      ? toast.error(
          `Error while attempting to update event: ${error.message}`,
          {
            position: toast.POSITION.TOP_RIGHT,
          }
        )
      : toast.success("Event successfully updated!", {
          position: toast.POSITION.TOP_RIGHT,
        });
  };

  const handleAdd = async () => {
    const formattedSources = sourcesArrayToDbString(newSources);
    const { error } = await supabase.from(tableName).insert({
      id,
      title: newTitle,
      slugTitle: stringToSlug(newTitle),
      date: newDate,
      category: newCategory,
      otd: newOtd,
      imgSrc: newImgSrc,
      imgAltText: newImgAltText,
      NSFW: newNSFW,
      description: newDescription,
      sources: formattedSources,
    });
    if (!error) {
      collapseAddForm?.();
    }
    error
      ? toast.error(`Error while attempting to add event: ${error.message}`, {
          position: toast.POSITION.TOP_RIGHT,
        })
      : toast.success("Event successfully added!", {
          position: toast.POSITION.TOP_RIGHT,
        });
  };

  const [month, day, year] = newDate.split("/");
  const formattedDate = `${year}-${month}-${day}`;

  const otdValid =
    newOtd && newOtd.match(/on this day/i) && newOtd.length < 246;
  const formValid =
    otdValid &&
    newSources?.[0] &&
    newTitle &&
    newDate &&
    newCategory &&
    newDescription;

  return (
    <>
      <ToastContainer autoClose={4000} />
      <Accordion sx={styles.accordionBackgroundColor}>
        <AccordionSummary>
          <div style={styles.accordionHeaderStyle}>
            <Typography>{title || "New Event"}</Typography>
            {!isEditMode && <DeleteIcon onClick={collapseAddForm} />}
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <div style={styles.formContainer}>
            <div style={styles.firstFormRow}>
              <StyledTextField
                required
                error={!newTitle}
                label="Title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
              <StyledTextField
                required
                error={!newDate}
                label="Date"
                type="date"
                value={formattedDate}
                onChange={handleNewDate}
              />
              <StyledTextField
                required
                error={!newCategory}
                label="Category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
            </div>
            <div style={styles.secondFormRow}>
              <StyledTextField
                label="Image Source (storage reference)"
                value={newImgSrc}
                onChange={(e) => setNewImgSrc(e.target.value)}
              />
              <StyledTextField
                multiline
                label="Image Caption"
                value={newImgAltText}
                onChange={(e) => setNewImgAltText(e.target.value)}
              />
              <div>
                <Typography>NSFW</Typography>
                <Checkbox
                  defaultChecked={NSFW}
                  sx={primaryTextColor}
                  onChange={() => setNewNSFW(!newNSFW)}
                />
              </div>
            </div>
            <StyledTextField
              required
              multiline
              error={!otdValid}
              label="On this day statement (social media title)"
              value={newOtd}
              onChange={(e) => setNewOtd(e.target.value)}
            />
            <StyledTextField
              required
              multiline
              error={!newDescription}
              label="Description"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              rows={9}
            />
            <SourcesInputs
              setNewSources={setNewSources}
              newSources={newSources}
              originalSources={originalSources}
            />
            <div>
              <StyledButton
                variant="contained"
                sx={styles.buttonStyle}
                onClick={handleSubmit}
                disabled={!formValid}
                type="button"
              >
                {`${isEditMode ? "Update" : "Add"}`}
              </StyledButton>
              {isEditMode && <DeleteButton id={id} />}
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
    </>
  );
};
