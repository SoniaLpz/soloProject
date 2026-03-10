import { it, expect } from "vitest";
import FavoritePetsPage from "./FavsPetPage.js";
import { render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import { MemoryRouter } from "react-router-dom";

const server = setupServer(
  http.get('/favorite', () => {
    return  HttpResponse.json([{ _id: '1', name: 'Buddy' }, { _id: '2', name: 'John' }])
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

   const results = (await screen.findAllByRole('heading')).map((fetchFavorites) => {
    return within(fetchFavorites).findByRole('pet-list')
  })


  expect(results.flat().length).toBeGreaterThan(0);


});
