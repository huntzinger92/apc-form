import { render, screen } from "@testing-library/react";
import { EventsByDate } from "./EventsByDate";

jest.mock("../../supabaseClient", () => ({
  __esModule: true,
  supabase: {
    from: jest.fn(),
  },
}));

describe("EventsByDate", () => {
  const mockFrom = jest.requireMock("../../supabaseClient").supabase.from;
  const mockEvents = [
    {
      id: "1",
      title: "Title 1",
      description: "Description 1",
      otd: "On this day 1",
      sources: "[]",
    },
    {
      id: "2",
      title: "Title 2",
      description: "Description 2",
      otd: "On this day 2",
      sources: "[]",
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
});
