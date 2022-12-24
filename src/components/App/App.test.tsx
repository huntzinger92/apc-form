import { screen, waitFor } from "@testing-library/react";
import App from "./App";
import { render } from "../../testUtils/renderWithProviders";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

jest.mock("../../supabaseClient", () => ({
  __esModule: true,
  supabase: {
    auth: {
      getUser: jest.fn(),
    },
    // handle the initial query by date that happens on mount
    from() {
      return {
        select() {
          return {
            like: jest.fn(() => ({})),
          };
        },
      };
    },
  },
}));

describe("App", () => {
  const mockGetUser: jest.Mock = jest.requireMock("../../supabaseClient")
    .supabase.auth.getUser;
  const mockUseNavigate = jest.requireMock("react-router-dom").useNavigate;
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetUser.mockImplementation(() => ({ user: "some trivial props" }));
    mockUseNavigate.mockImplementation(() => mockNavigate);
  });
  it("renders App header", () => {
    render(<App />);
    expect(screen.getByText("aPC Events Updater 9000")).toBeInTheDocument();
  });
  it("renders loading spinner by default", () => {
    render(<App />);
    expect(screen.getByTestId("auth-loading-spinner")).toBeInTheDocument();
  });
  it("removes loading spinner after auth check finishes", async () => {
    render(<App />);
    await waitFor(() =>
      expect(
        screen.queryByTestId("auth-loading-spinner")
      ).not.toBeInTheDocument()
    );
  });
  it("calls navigation with login path if auth check fails", async () => {
    mockGetUser.mockImplementation(() => ({ user: undefined }));
    render(<App />);
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("login"));
  });
});
