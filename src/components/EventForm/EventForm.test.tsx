import { render, screen } from "@testing-library/react";
import { EventForm } from "./EventForm";
import * as supabaseModule from "../../supabaseClient";

describe("EventForm", () => {
  const mockUpdate = jest.fn().mockImplementation(() => jest.fn());
  const mockInsert = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn<any, any>(supabaseModule, "supabase").mockImplementation(() => ({
      from() {
        return { update: mockUpdate, insert: mockInsert };
      },
    }));
  });
  const labels = [
    "Title",
    "Date",
    "Category",
    "Image Source (storage reference)",
    "Image Caption",
    "On this day statement (social media title)",
    "Description",
  ];
  it.each(labels)("renders expected labels", (label) => {
    render(<EventForm />);
    expect(screen.getByText(label)).toBeInTheDocument();
  });
});
