import RegisterPage from "./RegisterPage.js";
import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";

describe("RegisterPage", () => {
  test("renders the registration form", () => {
    render(<RegisterPage />);
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

  test("updates form data on input change", () => {
    render(<RegisterPage />);

    const emailInput = screen.getByPlaceholderText(/Email/i);
    const passwordInput = screen.getByPlaceholderText(/Password/i);
    const roleSelect = screen.getByLabelText(/Role/i);

    emailInput.value = "test@example.com";
    passwordInput.value = "password123";
    roleSelect.value = "user";

    expect(emailInput.value).toBe("test@example.com");
    expect(passwordInput.value).toBe("password123");
    expect(roleSelect.value).toBe("user");
  });
});
