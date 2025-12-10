// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CalendarView from "./CalendarView";
import { BrowserRouter } from "react-router-dom";

// Mock the hook
vi.mock("@/hooks/useCalendarEvents", () => ({
  useCalendarEvents: () => ({
    events: [
      {
        id: "1",
        title: "Test Event",
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        type: "user_task",
        status: "open",
        allDay: false,
        color: "#ff0000",
      },
    ],
    loading: false,
  }),
  exportCalendarIcs: vi.fn(),
}));

describe("CalendarView", () => {
  it("renders view mode buttons", () => {
    render(
      <BrowserRouter>
        <CalendarView />
      </BrowserRouter>,
    );

    expect(screen.getAllByText("Monat")[0]).toBeDefined();
    expect(screen.getAllByText("Woche")[0]).toBeDefined();
    expect(screen.getAllByText("Tag")[0]).toBeDefined();
    expect(screen.getAllByText("Agenda")[0]).toBeDefined();
  });

  it("switches to Week view", () => {
    render(
      <BrowserRouter>
        <CalendarView />
      </BrowserRouter>,
    );

    // Use getAllByText to handle potential duplicates (though distinct reason unclear)
    const weekBtn = screen.getAllByText("Woche")[0];
    fireEvent.click(weekBtn);

    // WeekView renders day headers like Mo, Di, etc.
    expect(screen.getAllByText("Mo")[0]).toBeDefined();
  });

  it("switches to Day view", () => {
    render(
      <BrowserRouter>
        <CalendarView />
      </BrowserRouter>,
    );

    const dayBtn = screen.getAllByText("Tag")[0];
    fireEvent.click(dayBtn);

    // DayView renders time slots 7:00 - 20:00
    expect(screen.getAllByText("7:00")[0]).toBeDefined();
    expect(screen.getAllByText("20:00")[0]).toBeDefined();
  });
});
