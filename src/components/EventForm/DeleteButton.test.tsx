import { screen, waitFor, within } from "@testing-library/react";
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
  it("shows delete modal on delete click", () => {
    render(<DeleteButton {...defaultProps} />);
    userEvent.click(screen.getByText("Delete"));
    expect(
      screen.getByText(
        "This action cannot be undone. Are you sure you want to delete this event?"
      )
    ).toBeInTheDocument();
  });
  it("clicking cancel closes delete modal", async () => {
    render(<DeleteButton {...defaultProps} />);
    userEvent.click(screen.getByText("Delete"));
    userEvent.click(screen.getByText("Cancel"));
    await waitFor(() =>
      expect(
        screen.queryByText(
          "This action cannot be undone. Are you sure you want to delete this event?"
        )
      ).not.toBeInTheDocument()
    );
  });
  it("deletes event of passed id on modal delete click", () => {
    render(<DeleteButton {...defaultProps} />);
    userEvent.click(screen.getByText("Delete"));
    userEvent.click(
      within(screen.getByTestId("delete-modal-buttons")).getByText("Delete")
    );
    expect(mockEqFilter).toHaveBeenCalledWith("id", "eventId");
  });
  it("refetches events on delete success", async () => {
    render(<DeleteButton {...defaultProps} />);
    userEvent.click(screen.getByText("Delete"));
    userEvent.click(
      within(screen.getByTestId("delete-modal-buttons")).getByText("Delete")
    );
    await waitFor(() => expect(mockFetchEvents).toHaveBeenCalledTimes(1));
  });
  it("does NOT refetch events on delete error", () => {
    mockEqFilter.mockImplementation(() => ({ error: { message: "ope" } }));
    render(<DeleteButton {...defaultProps} />);
    userEvent.click(screen.getByText("Delete"));
    userEvent.click(
      within(screen.getByTestId("delete-modal-buttons")).getByText("Delete")
    );
    expect(mockFetchEvents).toHaveBeenCalledTimes(0);
  });
});
