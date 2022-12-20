import { useState } from "react";
import { stringToSlug } from "./stringToSlug";
import { supabase } from "./supabaseClient";

// use generated supabase types
// hide password in UI (and encrypt it in network call? password is sent as plaintext)
// input validation (otd no longer than 245ish characters, spellcheck on OTD and description etc.)
// make sure description preserves new lines as expected
// allow addition or deletion of sources (separate component)
// make sure to send null to update api for optional values (seems to change db value from NULL to EMPTY if send empty string)
// add accordion to make each event collapsible
// non alert success and error handling (non auth attempt to update seems to cause 404?)
// CSS to prettify everything
// cleanup - create separate components/utils, organize directories
// tests

// create
// delete

// apply to real eventLibrary table!

// nice to haves:
// - search by term instead of day
// - display image
// - upload image from website so you don't have to go into supabase to change image (will also have to handle displaying it)

export const EventForm = ({ dayEvent }: any) => {
  const {
    id,
    title,
    otd,
    date,
    sources,
    imgSrc,
    imgAltText,
    description,
    category,
    NSFW,
  } = dayEvent;

  // sources is a stringified array, but due to current db formatting, needs single apostrophes replaced with double quotes
  const sourcesArray: string[] = JSON.parse(sources.replace(/'/g, '"'));

  const [newTitle, setNewTitle] = useState<string>(title);
  const [newDate, setNewDate] = useState<string>(date);
  const [newCategory, setNewCategory] = useState<string>(category);
  const [newOtd, setNewOtd] = useState<string>(otd);
  const [newImgSrc, setNewImgSrc] = useState<string>(imgSrc);
  const [newImgAltText, setNewImgAltText] = useState<string>(imgAltText);
  const [newNSFW, setNewNSFW] = useState<boolean>(!!NSFW);
  const [newDescription, setNewDescription] = useState<string>(description);
  const [newSources, setNewSources] = useState<string[]>(sourcesArray);

  const handleNewDate = (e: any) => {
    const [newYear, newMonth, newDay] = e.target.value.split("-");
    setNewDate(`${newMonth}/${newDay}/${newYear}`);
  };

  const handleNewSource = (linkString: string, index: number) => {
    const sourcesCopy = [...newSources];
    sourcesCopy[index] = linkString;
    setNewSources(sourcesCopy);
  };

  const handleSubmit = async () => {
    const stringifiedSources = JSON.stringify(newSources);
    const formattedSources = stringifiedSources.replace(/'/g, '"');
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
    alert(error ? error.message : "successful update");
  };

  const [month, day, year] = newDate.split("/");
  const formattedDate = `${year}-${month}-${day}`;

  return (
    <div>
      <div>
        <p>title</p>
        <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
      </div>
      <div>
        <p>date</p>
        <input type="date" value={formattedDate} onChange={handleNewDate} />
      </div>
      <div>
        <p>category</p>
        <input
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
      </div>
      <div>
        <p>on this day statement</p>
        <input value={newOtd} onChange={(e) => setNewOtd(e.target.value)} />
      </div>
      <div>
        <p>imgSrc</p>
        <input
          value={newImgSrc}
          onChange={(e) => setNewImgSrc(e.target.value)}
        />
      </div>
      <div>
        <p>imgAltText</p>
        <input
          value={newImgAltText}
          onChange={(e) => setNewImgAltText(e.target.value)}
        />
      </div>
      <div>
        <p>description</p>
        <textarea
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
        />
      </div>
      <div>
        <p>NSFW</p>
        <input
          type="checkbox"
          value={NSFW}
          onChange={() => setNewNSFW(!newNSFW)}
        />
      </div>
      <div>
        <p>sources</p>
        {newSources.map((source, index) => (
          <input
            key={sourcesArray[index]}
            value={source}
            onChange={(e) => handleNewSource(e.target.value, index)}
          />
        ))}
      </div>
      <button onClick={handleSubmit}>Update Event</button>
    </div>
  );
};
