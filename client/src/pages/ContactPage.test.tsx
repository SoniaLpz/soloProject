import ContactPage from "./ContactPage.js";
import { describe, test, expect, beforeEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import axios from "axios";

const mockInput = {
  name: "testname",
  email: "test@example.com",
  message: "I want to adopt Buddy",
};

vi.mock("axios");

// helper function: gets form elements
const getFormElements = () => ({
  nameInput: screen.getByPlaceholderText(/Your Name/i) as HTMLInputElement,
  emailInput: screen.getByPlaceholderText(/Your Email/i) as HTMLInputElement,
  messageInput: screen.getByPlaceholderText(
    /Your Message/i,
  ) as HTMLInputElement,
  button: screen.getByRole("button", { name: /Send Message/i }),
});

// helper function: fills form and submits it
const fillAndSubmitForm = async (user: ReturnType<typeof userEvent.setup>) => {
  const { nameInput, emailInput, messageInput, button } = getFormElements();
  await user.type(nameInput, mockInput.name);
  await user.type(emailInput, mockInput.email);
  await user.type(messageInput, mockInput.message);
  await user.click(button);
};

describe("ContactPage", () => {
  let user: ReturnType<typeof userEvent.setup>; // Define user variable to be used in tests
  beforeEach(() => {
    vi.mocked(axios.post).mockResolvedValue({}); // Mock successful response by default
    user = userEvent.setup(); // Initialize userEvent before each test
    render(<ContactPage />);
  });

  afterEach(() => {
    cleanup();
  });

  test("renders form", () => {
    const { nameInput, emailInput, messageInput, button } = getFormElements();
    expect(
      screen.getByRole("heading", { name: /Contact Us/i }),
    ).toBeInTheDocument();
    expect(nameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(messageInput).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  test("updates form data on input change", async () => {
    // Fill in the form fields and check that their values are updated correctly
    const { nameInput, emailInput, messageInput } = getFormElements();
    await user.type(nameInput, mockInput.name);
    await user.type(emailInput, mockInput.email);
    await user.type(messageInput, mockInput.message);
    expect(nameInput.value).toBe(mockInput.name);
    expect(emailInput.value).toBe(mockInput.email);
    expect(messageInput.value).toBe(mockInput.message);
  });

  test("handles submit on Send click", async () => {
    await fillAndSubmitForm(user);
    expect(axios.post).toHaveBeenCalledWith(
      // Check that axios.post was called with the correct URL and data
      "http://localhost:3000/contact",
      mockInput,
    );
    expect(
      await screen.findByText("Message sent successfully!"),
    ).toBeInTheDocument();
  });

  test("handles error message if submit was not succesfull", async () => {
    vi.mocked(axios.post).mockRejectedValue(
      new Error("Failed to send message. Please try again."),
    );
    await fillAndSubmitForm(user);
    expect(
      await screen.findByText("Failed to send message. Please try again."),
    ).toBeInTheDocument();
  });
});
