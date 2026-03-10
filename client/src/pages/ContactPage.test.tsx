import ContactPage from "./ContactPage.js";
import { describe, test, expect, beforeEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import axios from "axios";

const mockInput = {
  name: "testname",
  email: "test@example.com",
  message: "I want to adopt Buddy",
};
vi.mock("axios");

describe.only("ContactPage", () => {
  beforeEach(() => {
    render(<ContactPage />);
  });

  afterEach(() => {
    cleanup();
  });

  const nameElement = screen.getByPlaceholderText(
    /Your Name/i,
  ) as HTMLInputElement;
  const emailElement = screen.getByPlaceholderText(
    /Your Email/i,
  ) as HTMLInputElement;
  const messageElement = screen.getByPlaceholderText(
    /Your Message/i,
  ) as HTMLInputElement;

  test("renders form", () => {
    const button = screen.getByRole("button", { name: /Send Message/i });

    expect(nameElement).toBeInTheDocument();
    expect(emailElement).toBeInTheDocument();
    expect(messageElement).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  test("updates form data on input change", async () => {
    const user = userEvent.setup();

    await user.type(nameElement, mockInput.name);
    await user.type(emailElement, mockInput.email);
    await user.type(messageElement, mockInput.message);

    expect(nameElement.value).toBe(mockInput.name);
    expect(emailElement.value).toBe(mockInput.email);
    expect(messageElement.value).toBe(mockInput.message);
  });

  test("handle submit on Send click", async () => {
    const user = userEvent.setup();
    await user.type(nameElement, mockInput.name);
    await user.type(emailElement, mockInput.email);
    await user.type(messageElement, mockInput.message);
    const button = screen.getByRole("button", { name: /Send Message/i });
    await user.click(button);
    expect;
  });
});
