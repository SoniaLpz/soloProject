import RegisterPage from "./RegisterPage.js";
import { cleanup, render, screen } from "@testing-library/react";
import { describe, test, expect, beforeEach, vi } from "vitest";
import { userEvent } from "@testing-library/user-event";
import { register } from "../services/authService.js";

vi.mock("../services/authService.js", () => ({
  register: vi.fn().mockResolvedValue({}),
}));

const mockInput = {
  email: "test@example.com",
  password: "password",
  role: "adopter",
};

describe("RegisterPage", () => {
  beforeEach(() => {
    render(<RegisterPage />);
  });

  afterEach(() => {
    cleanup();
  });

  test("renders the registration form", () => {
    expect(
      screen.getByRole("heading", { name: /Register/i }),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Role/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Register/i }),
    ).toBeInTheDocument();
  });

  test("updates form data on input change", async () => {
    const user = userEvent.setup();

    const emailInput = screen.getByPlaceholderText(
      /Email/i,
    ) as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText(
      /Password/i,
    ) as HTMLInputElement;
    const roleSelect = screen.getByLabelText(/Role/i) as HTMLInputElement;

    await user.type(emailInput, mockInput.email);
    await user.type(passwordInput, mockInput.password);
    await user.selectOptions(roleSelect, mockInput.role);

    expect(emailInput.value).toBe(mockInput.email);
    expect(passwordInput.value).toBe(mockInput.password);
    expect(roleSelect.value).toBe(mockInput.role);
  });

  test("handles submit on register button click", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText(/Email/i), mockInput.email);
    await user.type(
      screen.getByPlaceholderText(/Password/i),
      mockInput.password,
    );
    await user.selectOptions(screen.getByLabelText(/Role/i), mockInput.role);

    const button = screen.getByRole("button", { name: /Register/i });
    await user.click(button);

    expect(register).toHaveBeenCalledWith(mockInput);
    expect(
      await screen.findByText("Registration successful! You can now log in."),
    ).toBeInTheDocument();
  });

  test("handles error message if submit was not successful", async () => {
    vi.mocked(register).mockRejectedValueOnce(
      new Error("Error registering. Please try again."),
    );
    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText(/Email/i), mockInput.email);
    await user.type(
      screen.getByPlaceholderText(/Password/i),
      mockInput.password,
    );
    await user.selectOptions(screen.getByLabelText(/Role/i), mockInput.role);
    const button = screen.getByRole("button", { name: /Register/i });
    await user.click(button);
    expect(
      await screen.findByText("Error registering. Please try again."),
    ).toBeInTheDocument();
  });
});
