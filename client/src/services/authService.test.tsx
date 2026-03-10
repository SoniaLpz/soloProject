import "./authService.js";
import { describe, test, vi, expect } from "vitest";
import axios from "axios";
import { register, login, getToken, logout } from "./authService.js";

vi.mock("axios");
const apiUrl = "http://localhost:3000/auth";

const mockUserData = {
  email: "test@example.com",
  password: "hashedpassword",
  role: "adopter",
};
const mockToken = "mockedtoken";
describe.only("authService", () => {
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
  });

  afterEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  test("register", async () => {
    vi.mocked(axios.post).mockResolvedValue({});
    await register(mockUserData);
    expect(axios.post).toHaveBeenCalledWith(`${apiUrl}/register`, mockUserData);
  });

  test("login", async () => {
    vi.mocked(axios.post).mockResolvedValue({
      data: { token: mockToken, role: "adopter" },
    });
    await login(mockUserData);
    expect(axios.post).toHaveBeenCalledWith(`${apiUrl}/login`, mockUserData);
    expect(localStorage.getItem("token")).toBe(mockToken);
  });

  test("logout", () => {
    logout();
    expect(localStorage.getItem("token")).toBeNull();
  });

  test("getToken", () => {
    expect(getToken()).toBe(mockToken);
  });
});
