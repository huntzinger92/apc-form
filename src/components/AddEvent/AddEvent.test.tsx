import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddEvent } from "./AddEvent";

jest.mock("../../supabaseClient", () => ({
  __esModule: true,
  supabase: {
    from: jest.fn(),
  },
}));

describe("AddEvent", () => {
  it("renders Add New Event button", () => {
    render(<AddEvent />);
    expect(screen.getByText("Add New Event")).toBeInTheDocument();
  });
  it("removes Add New Event button on button click", () => {
    render(<AddEvent />);
    userEvent.click(screen.getByText("Add New Event"));
    expect(screen.queryByText("Add New Event")).not.toBeInTheDocument();
  });
  it("clicking discard event icon brings back add new event button", () => {
    render(<AddEvent />);
    userEvent.click(screen.getByText("Add New Event"));
    userEvent.click(screen.getByTestId("discard-event-icon"));
    expect(screen.getByText("Add New Event")).toBeInTheDocument();
  });
});
