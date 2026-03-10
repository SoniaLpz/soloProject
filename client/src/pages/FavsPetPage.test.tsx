import { vi, describe, it, expect } from "vitest";
import FavoritePetsPage from "./FavsPetPage.js";
import { render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import { MemoryRouter } from "react-router-dom";

const server = setupServer(
  http.get("/favorite", () => {
    return HttpResponse.json({ message: "List Favorite" });
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

it("List Favorite", async () => {
  render(
    <MemoryRouter>
      <FavoritePetsPage />
    </MemoryRouter>,
  );

  userEvent.type(screen.getByRole("heading", { name: "Favorite Pets" }));

  const results = screen.getAllByRole("list").map((favorites) => {
    return within(favorites).getByRole("heading", { name: "Favorite Pets" })
      .textContent;
  });

  expect(results).toMatchInlineSnapshot();
});
