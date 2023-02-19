import { screen, waitFor } from "@testing-library/react";
import { render } from "../../testUtils/renderWithProviders";
import { IEvent } from "../../types";
import { EventsByDate } from "./EventsByDate";

jest.mock("../../supabaseClient", () => ({
  __esModule: true,
  supabase: {
    from: jest.fn(),
  },
}));

describe("EventsByDate", () => {
  const mockFrom = jest.requireMock("../../supabaseClient").supabase.from;
  const mockEvents: Partial<IEvent>[] = [
    {
      id: "1",
      title: "Title 1",
      description: "Description 1",
      otd: "On this day 1",
      links: [],
    },
    {
      id: "2",
      title: "Title 2",
      description: "Description 2",
      otd: "On this day 2",
      links: [],
    },
  ];
  const mockLikeFilter = jest.fn(() => ({ data: mockEvents }));
  const mockSelect = jest.fn(() => ({ like: mockLikeFilter }));
  beforeEach(() => {
    jest.clearAllMocks();
    mockFrom.mockImplementation(() => ({
      select: mockSelect,
    }));
  });
  const eventTitles = ["Title 1", "Title 2"];
  it.each(eventTitles)(
    "renders the title of each fetched event",
    async (eventTitle) => {
      render(<EventsByDate />);
      expect(await screen.findByText(eventTitle)).toBeInTheDocument();
    }
  );
  it("renders a loading spinner on mount", () => {
    render(<EventsByDate />);
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });
  it("removes loading spinner after query success", async () => {
    render(<EventsByDate />);
    await waitFor(() =>
      expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument()
    );
  });
  it("displays error toast on query error", async () => {
    //@ts-ignore-next-line
    mockLikeFilter.mockImplementation(() => ({
      error: { message: "message" },
    }));
    render(<EventsByDate />);
    expect(
      await screen.findByText("Error while fetching events: message")
    ).toBeInTheDocument();
  });
  it("tells user that no events found when no events found", async () => {
    mockLikeFilter.mockImplementation(() => ({
      data: [],
    }));
    render(<EventsByDate />);
    expect(await screen.findByText("No events found!")).toBeInTheDocument();
  });
});
