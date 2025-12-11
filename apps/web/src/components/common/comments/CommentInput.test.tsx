// @vitest-environment jsdom
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { CommentInput } from "./CommentInput";
import { authApi } from "@/services/apiClient";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";

// Mock the authApi
vi.mock("@/services/apiClient", () => ({
    authApi: {
        getUsers: vi.fn(),
    },
}));

describe("CommentInput", () => {
    const mockSubmit = vi.fn();
    const mockUsers = [
        { _id: "1", displayName: "Alice Wonderland", username: "alice", email: "alice@example.com", type: "user", roles: [], primaryRole: "user", active: true },
        { _id: "2", displayName: "Bob Builder", username: "bob", email: "bob@example.com", type: "user", roles: [], primaryRole: "user", active: true },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        (authApi.getUsers as any).mockResolvedValue({ data: mockUsers });
    });

    afterEach(() => {
        cleanup();
    });

    it("renders input correctly", () => {
        render(<CommentInput onSubmit={mockSubmit} />);
        expect(screen.getByPlaceholderText("Schreibe einen Kommentar...")).toBeTruthy();
    });

    it("fetches users on mount", async () => {
        render(<CommentInput onSubmit={mockSubmit} />);
        await waitFor(() => {
            expect(authApi.getUsers).toHaveBeenCalledTimes(1);
        });
    });

    it("shows suggestions when typing @", async () => {
        render(<CommentInput onSubmit={mockSubmit} />);
        const textarea = screen.getByPlaceholderText("Schreibe einen Kommentar...");

        // Wait for users to load
        await waitFor(() => expect(authApi.getUsers).toHaveBeenCalled());

        // Type "Hello @"
        fireEvent.change(textarea, { target: { value: "Hello @" } });

        // Check if suggestions appear
        await waitFor(() => {
            expect(screen.getByText("Alice Wonderland")).toBeTruthy();
            expect(screen.getByText("Bob Builder")).toBeTruthy();
        });
    });

    it("filters suggestions based on query", async () => {
        render(<CommentInput onSubmit={mockSubmit} />);
        const textarea = screen.getByPlaceholderText("Schreibe einen Kommentar...");
        await waitFor(() => expect(authApi.getUsers).toHaveBeenCalled());

        fireEvent.change(textarea, { target: { value: "@ali" } });

        await waitFor(() => {
            expect(screen.getByText("Alice Wonderland")).toBeTruthy();
            expect(screen.queryByText("Bob Builder")).toBeNull();
        });
    });

    it("inserts mention on selection", async () => {
        render(<CommentInput onSubmit={mockSubmit} />);
        const textarea = screen.getByPlaceholderText("Schreibe einen Kommentar...") as HTMLTextAreaElement;
        await waitFor(() => expect(authApi.getUsers).toHaveBeenCalled());

        fireEvent.change(textarea, { target: { value: "@ali" } });

        await waitFor(() => {
            expect(screen.getByText("Alice Wonderland")).toBeTruthy();
        });

        fireEvent.click(screen.getByText("Alice Wonderland"));

        // Expected: "@alice " (plus leading/trailing context if any)
        expect(textarea.value).toBe("@alice ");
    });
});
