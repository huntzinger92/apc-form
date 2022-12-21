import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { ChangeEvent, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { stringToSlug } from "./stringToSlug";
import { supabase } from "./supabaseClient";
import { IEvent } from "./types";
import * as styles from "./EventForm.styles";
import { SourcesInputs } from "./SourcesInputs";

// use generated supabase types (need to install docker?)
// non alert success and error handling (non auth attempt to update seems to cause 404?)
// CSS to prettify everything (remove App.css)
// cleanup - create separate components/utils, organize directories, readme, icon in browser
// tests

// create
// delete

// apply to real eventLibrary table!

// nice to haves:
// - search by term instead of day
// - display image
// - upload image from website so you don't have to go into supabase to change image (will also have to handle displaying it)
// - deploy so you don't have to use on your laptop running

const getDefaultDate = () => {
  const today = new Date();
  return `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
};

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
  const originalSources: string[] = JSON.parse(sources.replace(/'/g, '"'));

  const [newTitle, setNewTitle] = useState(title);
  const [newDate, setNewDate] = useState(date);
  const [newCategory, setNewCategory] = useState(category);
  const [newOtd, setNewOtd] = useState(otd);
  const [newImgSrc, setNewImgSrc] = useState(imgSrc);
  const [newImgAltText, setNewImgAltText] = useState<string>(imgAltText);
  const [newNSFW, setNewNSFW] = useState<boolean>(!!NSFW);
  const [newDescription, setNewDescription] = useState(description);
  const [newSources, setNewSources] = useState<string[]>(originalSources);

  const handleNewDate = (e: ChangeEvent<HTMLInputElement>) => {
    const [newYear, newMonth, newDay] = e.target.value.split("-");
    setNewDate(`${newMonth}/${newDay}/${newYear}`);
  };

  const handleSubmit = async () => {
    // remove empty sources that user may have left unresolved
    const filteredSources = newSources.filter((source) => source);
    const stringifiedSources = JSON.stringify(filteredSources);
    const formattedSources = stringifiedSources.replace(/"/g, "'");
    if (isEditMode) {
      const { error } = await supabase
        .from("eventLibrary_test")
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
      alert(error ? error.message : "Event successfully updated!");
    } else {
      // add event
      const { error } = await supabase.from("eventLibrary_test").insert({
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
      alert(error ? error.message : "Event successfully added!");
    }
  };

  const handleDelete = async () => {
    const { error } = await supabase
      .from("eventLibrary_test")
      .delete()
      .eq("id", id);
    alert(error ? error.message : "Successfully deleted event!");
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
    <Accordion>
      <AccordionSummary>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Typography>{title || "New Event"}</Typography>
          {!isEditMode && <RemoveIcon onClick={collapseAddForm} />}
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <div style={styles.formContainer}>
          <div style={styles.firstFormRow}>
            <TextField
              required
              error={!newTitle}
              label="Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <TextField
              required
              error={!newDate}
              label="Date"
              type="date"
              value={formattedDate}
              onChange={handleNewDate}
            />
            <TextField
              required
              error={!newCategory}
              label="Category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
          </div>
          <div style={styles.secondFormRow}>
            <TextField
              label="Image Source (supabase storage reference)"
              value={newImgSrc}
              onChange={(e) => setNewImgSrc(e.target.value)}
            />
            <TextField
              multiline
              label="Image Caption"
              value={newImgAltText}
              onChange={(e) => setNewImgAltText(e.target.value)}
            />
            <div>
              <Typography>NSFW</Typography>
              <Checkbox
                defaultChecked={NSFW}
                onChange={() => setNewNSFW(!newNSFW)}
              />
            </div>
          </div>
          <TextField
            required
            multiline
            error={!otdValid}
            label="On this day statement (social media title)"
            value={newOtd}
            onChange={(e) => setNewOtd(e.target.value)}
          />
          <TextField
            required
            multiline
            error={!newDescription}
            label="Description"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            rows={12}
          />
          <SourcesInputs
            setNewSources={setNewSources}
            newSources={newSources}
            originalSources={originalSources}
          />
          <div>
            <Button
              style={styles.buttonStyle}
              onClick={handleSubmit}
              disabled={!formValid}
              type="button"
            >
              {`${isEditMode ? "Update" : "Add"} Event`}
            </Button>
            {isEditMode && (
              <DeleteIcon
                style={{ cursor: "pointer" }}
                onClick={handleDelete}
              />
            )}
          </div>
        </div>
      </AccordionDetails>
    </Accordion>
  );
};
