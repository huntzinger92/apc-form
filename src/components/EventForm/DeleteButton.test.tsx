import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DeleteButton } from "./DeleteButton";

jest.mock("../../supabaseClient", () => ({
  __esModule: true,
  supabase: {
    from: jest.fn(),
  },
}));

describe("DeleteButton", () => {
  const defaultProps = { id: "eventId" };
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
  it("deletes event of passed id on delete click", () => {
    render(<DeleteButton {...defaultProps} />);
    userEvent.click(screen.getByText("Delete"));
    expect(mockEqFilter).toHaveBeenCalledWith("id", "eventId");
  });
});
