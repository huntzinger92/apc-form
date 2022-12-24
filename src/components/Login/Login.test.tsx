import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "../../testUtils/renderWithProviders";
import { Login } from "./Login";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

jest.mock("../../supabaseClient", () => ({
  __esModule: true,
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
    },
  },
}));

describe("Login", () => {
  const mockSignIn: jest.Mock = jest.requireMock("../../supabaseClient")
    .supabase.auth.signInWithPassword;
  const mockUseNavigate = jest.requireMock("react-router-dom").useNavigate;
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockSignIn.mockImplementation(() => ({}));
    mockUseNavigate.mockImplementation(() => mockNavigate);
  });
  const inputLabels = ["Username", "Password"];
  it.each(inputLabels)("renders expected labels", (inputLabel) => {
    render(<Login />);
    expect(screen.getAllByText(inputLabel)).toHaveLength(2);
  });
  it("renders login button", () => {
    render(<Login />);
    expect(screen.getByText("Login")).toBeInTheDocument();
  });
  describe("login success behavior", () => {
    it("clicking login button adds success toast", async () => {
      render(<Login />);
      userEvent.click(screen.getByText("Login"));
      expect(
        await screen.findByText("Successfully logged in!")
      ).toBeInTheDocument();
    });
    it("clicking login button calls login api with expected params", async () => {
      render(<Login />);
      userEvent.type(screen.getByLabelText("Username"), "email");
      userEvent.type(screen.getByLabelText("Password"), "password");
      userEvent.click(screen.getByText("Login"));
      expect(mockSignIn).toHaveBeenCalledWith({
        email: "email",
        password: "password",
      });
    });
    it("redirects user back to homepage on login success", async () => {
      render(<Login />);
      userEvent.click(screen.getByText("Login"));
      await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/"));
    });
  });
  describe("login error behavior", () => {
    beforeEach(() => {
      mockSignIn.mockImplementation(() => ({
        error: { message: "the series of tubes is down" },
      }));
    });
    it("clicking login button adds error toast", async () => {
      render(<Login />);
      userEvent.click(screen.getByText("Login"));
      expect(
        await screen.findByText(
          "Error while logging in: the series of tubes is down"
        )
      ).toBeInTheDocument();
    });
  });
});
