import AdminMessages from "./AdminMessages.js";
import { describe, test, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import axios from "axios";

vi.mock("axios");

const mockMessages = [
  {
    _id: "1",
    name: "testname",
    email: "test@example.com",
    message: "I want to adopt Buddy!",
  },
];

const mockToken = "mockedtoken";

describe("AdminMessages Component", () => {
  let storage: Record<string, string> = {};

  beforeEach(() => {
    storage = {};

    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: (key: string) => storage[key] || null,
        setItem: (key: string, value: string) => {
          storage[key] = value;
        },
        removeItem: (key: string) => {
          delete storage[key];
        },
        clear: () => {
          storage = {};
        },
        get length() {
          return Object.keys(storage).length;
        },
        key: (index: number) => Object.keys(storage)[index] || null,
      } satisfies Storage,
      writable: true,
    });

    localStorage.setItem("token", mockToken);
    vi.mocked(axios.get).mockResolvedValue({ data: mockMessages });
    render(<AdminMessages />);
  });

  afterEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  test("renders the list of messages if call was successfull", async () => {
    expect(
      await screen.findByText(mockMessages[0]!.message),
    ).toBeInTheDocument();
    expect(await screen.findByText(mockMessages[0]!.name)).toBeInTheDocument();
    expect(await screen.findByText(mockMessages[0]!.email)).toBeInTheDocument();
  });
});
