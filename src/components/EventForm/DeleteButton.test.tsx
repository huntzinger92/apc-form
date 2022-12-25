import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "../../testUtils/renderWithProviders";
import { DeleteButton } from "./DeleteButton";

jest.mock("../../supabaseClient", () => ({
  __esModule: true,
  supabase: {
    from: jest.fn(),
  },
}));

describe("DeleteButton", () => {
  const mockFetchEvents = jest.fn();
  const defaultProps = {
    id: "eventId",
    loading: false,
    fetchEvents: mockFetchEvents,
  };
  const mockFrom = jest.requireMock("../../supabaseClient").supabase.from;
  const mockEqFilter = jest.fn(() => ({}));
  const mockDelete = jest.fn(() => ({ eq: mockEqFilter }));
  beforeEach(() => {
    jest.clearAllMocks();
    mockFrom.mockImplementation(() => ({ delete: mockDelete }));
  });
  it("renders Delete button", () => {
    render(<DeleteButton {...defaultProps} />);
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });
  it("disables Delete button if loading", () => {
    render(<DeleteButton {...defaultProps} loading />);
    expect(screen.getByText("Delete")).toBeDisabled();
  });
  it("deletes event of passed id on delete click", () => {
    render(<DeleteButton {...defaultProps} />);
    userEvent.click(screen.getByText("Delete"));
    expect(mockEqFilter).toHaveBeenCalledWith("id", "eventId");
  });
  it("refetches events on delete success", async () => {
    render(<DeleteButton {...defaultProps} />);
    userEvent.click(screen.getByText("Delete"));
    await waitFor(() => expect(mockFetchEvents).toHaveBeenCalledTimes(1));
  });
  it("does NOT refetch events on delete error", () => {
    mockEqFilter.mockImplementation(() => ({ error: { message: "ope" } }));
    render(<DeleteButton {...defaultProps} />);
    userEvent.click(screen.getByText("Delete"));
    expect(mockFetchEvents).toHaveBeenCalledTimes(0);
  });
});
