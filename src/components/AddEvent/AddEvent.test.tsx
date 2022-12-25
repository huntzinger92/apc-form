import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "../../testUtils/renderWithProviders";
import { AddEvent } from "./AddEvent";

jest.mock("../../supabaseClient", () => ({
  __esModule: true,
  supabase: {
    from: jest.fn(),
  },
}));

describe("AddEvent", () => {
  const mockFetchEvents = jest.fn();
  const defaultProps = { fetchEvents: mockFetchEvents };
  it("renders Add New Event button", () => {
    render(<AddEvent {...defaultProps} />);
    expect(screen.getByText("Add New Event")).toBeInTheDocument();
  });
  it("removes Add New Event button on button click", () => {
    render(<AddEvent {...defaultProps} />);
    userEvent.click(screen.getByText("Add New Event"));
    expect(screen.queryByText("Add New Event")).not.toBeInTheDocument();
  });
  it("clicking discard event button brings back add new event button", () => {
    render(<AddEvent {...defaultProps} />);
    userEvent.click(screen.getByText("Add New Event"));
    userEvent.click(screen.getByText("Discard"));
    expect(screen.getByText("Add New Event")).toBeInTheDocument();
  });
});
