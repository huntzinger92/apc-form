import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "../../testUtils/renderWithProviders";
import { EventForm } from "./EventForm";

jest.mock("../../supabaseClient", () => ({
  __esModule: true,
  supabase: {
    from: jest.fn(),
  },
}));

describe("EventForm", () => {
  const mockFetchEvents = jest.fn();
  const defaultProps = { fetchEvents: mockFetchEvents };
  const mockFrom = jest.requireMock("../../supabaseClient").supabase.from;
  const mockEqFilter = jest.fn();
  const mockUpdate = jest.fn();
  const mockInsert = jest.fn(() => ({}));
  beforeEach(() => {
    jest.clearAllMocks();
    mockEqFilter.mockImplementation(() => ({}));
    mockUpdate.mockImplementation(() => ({ eq: mockEqFilter }));
    mockInsert.mockImplementation(() => ({}));
    mockFrom.mockImplementation(() => ({
      update: mockUpdate,
      insert: mockInsert,
    }));
  });
  const inputLabels = [
    "Title",
    "Date",
    "Category",
    "On this day statement (social media title)",
    "Description",
  ];
  it.each(inputLabels)("renders expected input labels", (inputLabel) => {
    render(<EventForm {...defaultProps} />);
    expect(screen.getByText(inputLabel)).toBeInTheDocument();
  });
  const imageLabels = ["Image Source (storage reference)", "Image Caption"];
  it.each(imageLabels)("renders expected image labels", (imageLabel) => {
    render(<EventForm {...defaultProps} />);
    expect(screen.getAllByText(imageLabel)).toHaveLength(2);
  });
  describe("edit mode behavior", () => {
    const editProps = {
      fetchEvents: mockFetchEvents,
      dayEvent: {
        id: "eventId",
        title: "testTitle",
        otd: "On this day",
        date: "12/23/2022",
        links: ["some-url.com"],
        imgSrc: "testImgSrc",
        imgAltText: "testImgAltText",
        description: "testDescription",
        tags: [],
        NSFW: false,
        slugTitle: "slugTitle",
      },
    };
    it("shows update button in edit mode", () => {
      render(<EventForm {...editProps} />);
      expect(screen.getByText("Update")).toBeInTheDocument();
    });
    it("shows delete button in edit mode", () => {
      render(<EventForm {...editProps} />);
      expect(screen.getByText("Delete")).toBeInTheDocument();
    });
    it("renders original title as accordion header", () => {
      render(<EventForm {...editProps} />);
      expect(screen.getByText("testTitle")).toBeInTheDocument();
    });
    const inputLabelsAndValues = [
      "testTitle",
      "2022-12-23",
      "Other",
      "testImgSrc",
      "testImgAltText",
      "On this day",
      "testDescription",
      "some-url.com",
    ];
    it.each(inputLabelsAndValues)(
      "defaults inputs to passed day event values",
      (value) => {
        render(<EventForm {...editProps} />);
        expect(screen.getByDisplayValue(value)).toBeInTheDocument();
      }
    );
    it("renders success toast on update success", async () => {
      render(<EventForm {...editProps} />);
      userEvent.click(screen.getByText("Update"));
      expect(
        await screen.findByText("Event successfully updated!")
      ).toBeInTheDocument();
    });
    it("renders error toast on update error", async () => {
      mockEqFilter.mockImplementation(() => ({
        error: { message: "apocalypse now" },
      }));
      render(<EventForm {...editProps} />);
      userEvent.click(screen.getByText("Update"));
      expect(
        await screen.findByText(
          "Error while attempting to update event: apocalypse now"
        )
      ).toBeInTheDocument();
    });
    it("updates on id of passed day event", async () => {
      render(<EventForm {...editProps} />);
      userEvent.click(screen.getByText("Update"));
      expect(mockEqFilter).toHaveBeenCalledWith("id", "eventId");
    });
    it("calls update api with updated values", async () => {
      render(<EventForm {...editProps} />);
      // update all inputs (missing datepicker here, still trying to figure out how to adjust its input)
      userEvent.type(screen.getByDisplayValue("testTitle"), "1");
      userEvent.type(screen.getByDisplayValue("Other"), "1");
      userEvent.type(screen.getByDisplayValue("testImgSrc"), "1");
      userEvent.type(screen.getByDisplayValue("testImgAltText"), "1");
      userEvent.type(screen.getByDisplayValue("On this day"), "1");
      userEvent.type(screen.getByDisplayValue("testDescription"), "1");
      userEvent.type(screen.getByDisplayValue("some-url.com"), "1");
      userEvent.click(screen.getByLabelText("NSFW"));
      userEvent.click(screen.getByText("Update"));
      expect(mockUpdate).toHaveBeenCalledWith({
        NSFW: true,
        category: "Other1",
        date: "12/23/2022",
        description: "testDescription1",
        imgAltText: "testImgAltText1",
        imgSrc: "testImgSrc1",
        otd: "On this day1",
        slugTitle: "testtitle1",
        sources: "['some-url.com1']",
        title: "testTitle1",
      });
    });
    it("refetches events on update success", async () => {
      render(<EventForm {...editProps} />);
      userEvent.click(screen.getByText("Update"));
      await waitFor(() => expect(mockFetchEvents).toHaveBeenCalledTimes(1));
    });
  });
  describe("add mode behavior", () => {
    const mockAddFormCallback = jest.fn();
    const addProps = {
      fetchEvents: mockFetchEvents,
      collapseAddForm: mockAddFormCallback,
    };
    const addModeButtons = ["Save", "Discard"];
    it.each(addModeButtons)("shows add mode buttons", (addModeButton) => {
      render(<EventForm {...addProps} />);
      expect(screen.getByText(addModeButton)).toBeInTheDocument();
    });
    it("does NOT show delete button in add mode", () => {
      render(<EventForm {...addProps} />);
      expect(screen.queryByText("Delete")).not.toBeInTheDocument();
    });
    it("add event button disabled by default", () => {
      render(<EventForm {...addProps} />);
      expect(screen.getByText("Save")).toBeDisabled();
    });
    it("renders success toast on insert success", async () => {
      render(<EventForm {...addProps} />);
      // update inputs to make form valid
      userEvent.type(screen.getByPlaceholderText("Title"), "1");
      userEvent.type(screen.getByPlaceholderText("Category"), "1");
      userEvent.type(
        screen.getByPlaceholderText("On this day..."),
        "On this day"
      );
      userEvent.type(screen.getByPlaceholderText("Description"), "1");
      userEvent.click(screen.getByTestId("add-source-icon"));
      userEvent.type(
        screen.getByPlaceholderText("https://en.wikipedia.org/"),
        "1"
      );
      userEvent.click(screen.getByText("Save"));
      expect(
        await screen.findByText("Event successfully added!")
      ).toBeInTheDocument();
    });
    it("calls collapse add form on insert success", async () => {
      render(<EventForm {...addProps} />);
      // update inputs to make form valid
      userEvent.type(screen.getByPlaceholderText("Title"), "1");
      userEvent.type(screen.getByPlaceholderText("Category"), "1");
      userEvent.type(
        screen.getByPlaceholderText("On this day..."),
        "On this day"
      );
      userEvent.type(screen.getByPlaceholderText("Description"), "1");
      userEvent.click(screen.getByTestId("add-source-icon"));
      userEvent.type(
        screen.getByPlaceholderText("https://en.wikipedia.org/"),
        "1"
      );
      userEvent.click(screen.getByText("Save"));
      await waitFor(() => expect(mockAddFormCallback).toHaveBeenCalledTimes(1));
    });
    it("renders error toast on insert error", async () => {
      mockInsert.mockImplementation(() => ({
        error: { message: "apocalypse now" },
      }));
      render(<EventForm {...addProps} />);
      // update inputs to make form valid
      userEvent.type(screen.getByPlaceholderText("Title"), "1");
      userEvent.type(screen.getByPlaceholderText("Category"), "1");
      userEvent.type(
        screen.getByPlaceholderText("On this day..."),
        "On this day"
      );
      userEvent.type(screen.getByPlaceholderText("Description"), "1");
      userEvent.click(screen.getByTestId("add-source-icon"));
      userEvent.type(
        screen.getByPlaceholderText("https://en.wikipedia.org/"),
        "1"
      );
      userEvent.click(screen.getByText("Save"));
      expect(
        await screen.findByText(
          "Error while attempting to add event: apocalypse now"
        )
      ).toBeInTheDocument();
    });
    it("does NOT call collapseAddForm on insert error", async () => {
      mockInsert.mockImplementation(() => ({
        error: { message: "apocalypse now" },
      }));
      render(<EventForm {...addProps} />);
      // update inputs to make form valid
      userEvent.type(screen.getByPlaceholderText("Title"), "1");
      userEvent.type(screen.getByPlaceholderText("Category"), "1");
      userEvent.type(
        screen.getByPlaceholderText("On this day..."),
        "On this day"
      );
      userEvent.type(screen.getByPlaceholderText("Description"), "1");
      userEvent.click(screen.getByTestId("add-source-icon"));
      userEvent.type(
        screen.getByPlaceholderText("https://en.wikipedia.org/"),
        "1"
      );
      userEvent.click(screen.getByText("Save"));
      expect(mockAddFormCallback).toHaveBeenCalledTimes(0);
    });
    it("calls insert api with updated values", async () => {
      render(<EventForm {...addProps} />);
      // update all inputs (missing datepicker here, still trying to figure out how to adjust its input)
      userEvent.type(screen.getByPlaceholderText("Title"), "1");
      userEvent.type(screen.getByPlaceholderText("Category"), "1");
      userEvent.type(screen.getByPlaceholderText("Event/someImg.jpg"), "1");
      userEvent.type(screen.getByPlaceholderText("Image Caption"), "1");
      userEvent.type(
        screen.getByPlaceholderText("On this day..."),
        "On this day"
      );
      userEvent.type(screen.getByPlaceholderText("Description"), "1");
      userEvent.click(screen.getByTestId("add-source-icon"));
      userEvent.type(
        screen.getByPlaceholderText("https://en.wikipedia.org/"),
        "1"
      );
      userEvent.click(screen.getByLabelText("NSFW"));
      userEvent.click(screen.getByText("Save"));
      expect(mockInsert).toHaveBeenCalledWith({
        NSFW: true,
        category: "1",
        date: expect.any(String),
        description: "1",
        id: expect.any(String),
        imgAltText: "1",
        imgSrc: "1",
        otd: "On this day",
        slugTitle: "1",
        sources: "['1']",
        title: "1",
      });
    });
    it("refetches events on insert success", async () => {
      render(<EventForm {...addProps} />);
      userEvent.type(screen.getByPlaceholderText("Title"), "1");
      userEvent.type(screen.getByPlaceholderText("Category"), "1");
      userEvent.type(
        screen.getByPlaceholderText("On this day..."),
        "On this day"
      );
      userEvent.type(screen.getByPlaceholderText("Description"), "1");
      userEvent.click(screen.getByTestId("add-source-icon"));
      userEvent.type(
        screen.getByPlaceholderText("https://en.wikipedia.org/"),
        "1"
      );
      userEvent.click(screen.getByText("Save"));
      await waitFor(() => expect(mockFetchEvents).toHaveBeenCalledTimes(1));
    });
  });
});
