import HomePage from "./HomePage.js";
import { describe, expect, test } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import PetListPage from "./PetListPage.js";
import RegisterPage from "./RegisterPage.js";
import ContactPage from "./ContactPage.js";

vi.mock("./PetListPage.js", () => ({
  default: () => <h1>Available Pets For Adoption</h1>,
}));

vi.mock("./RegisterPage.js", () => ({
  default: () => <h1>Register</h1>,
}));

vi.mock("./ContactPage.js", () => ({
  default: () => <h1>Contact Us</h1>,
}));

describe("HomePage", () => {
  afterEach(() => {
    cleanup();
  });

  test("renders text, image and links", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole("heading", { name: /Welcome to PetAdopt/i }),
    ).toBeInTheDocument();
    expect(screen.getByAltText("dashboard")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /View Pets/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Register as Shelter/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Contact Us/i }),
    ).toBeInTheDocument();
  });

  test("navigates to PetListPage on button click", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/pets" element={<PetListPage />} />
        </Routes>
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button", { name: /View Pets/i }));
    expect(
      await screen.findByRole("heading", {
        name: /Available Pets For Adoption/i,
      }),
    ).toBeInTheDocument();
  });

  test("navigates to RegisterPage on button click", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </MemoryRouter>,
    );

    await user.click(
      screen.getByRole("button", { name: /Register as Shelter/i }),
    );
    expect(
      await screen.findByRole("heading", { name: /Register/i }),
    ).toBeInTheDocument();
  });

  test("navigates to ContactPage on button click", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button", { name: /Contact Us/i }));
    expect(
      await screen.findByRole("heading", { name: /Contact Us/i }),
    ).toBeInTheDocument();
  });
});
