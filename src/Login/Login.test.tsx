import { render, screen } from "@testing-library/react";
import { Login } from "./Login";
import * as supabaseModule from "../supabaseClient";

describe("Login", () => {
  const mockAuth = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn<any, any>(supabaseModule, "supabase").mockImplementation(() => ({
      auth: {
        signInWithPassword: mockAuth,
      },
    }));
  });
  const labels = ["Username", "Password", "Login"];
  it.each(labels)("renders expected labels", (label) => {
    render(<Login />);
    expect(screen.getByText(label)).toBeInTheDocument();
  });
});
