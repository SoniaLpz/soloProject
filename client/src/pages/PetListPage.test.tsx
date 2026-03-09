import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {describe, test, expect, vi} from 'vitest';
import axios from 'axios';
import PetListPage from './PetListPage.js';
import { MemoryRouter } from 'react-router-dom';

vi.mock('axios'); // mock axios

//Mock child components
vi.mock('../components/PetCard.jsx', () => ({
  default: ({pet}: any ) => <div>{pet.name}</div>
}));

vi.mock('../components/MapComponent.jsx', () => ({
  default: () => <div>Map</div>
}));

const mockPets = [
  {
    _id: "1",
    name: "Buddy",
    type: "Dog",
    city: "London",
    age: 3
  },
  {
    _id: "2",
    name: "John",
    type: "Cat",
    city: "Manchester",
    age: 1
  }
];

describe('PetListPage', () => {

  test('Renders page', () => {

    (axios.get as any).mockResolvedValue({data: []});

    render(
      <MemoryRouter>
        <PetListPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/available pets for adoption/i)).toBeInTheDocument();

  });

  test('Displays pets', async () => {

    (axios.get as any).mockResolvedValue({data: mockPets});

    render(
      <MemoryRouter>
        <PetListPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Buddy")).toBeInTheDocument();
      expect(screen.getByText("John")).toBeInTheDocument();
    });

  });

  test('Filter pets by type', async () => {

    (axios.get as any).mockResolvedValue({data: mockPets});

    const user = (userEvent as any).setup();

    render(
      <MemoryRouter>
        <PetListPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Buddy")).toBeInTheDocument();
    });
    const input = screen.getByPlaceholderText("Type (e.g., Cat)");
    await user.type(input, "Dog");

    expect(screen.getByText("Buddy")).toBeInTheDocument();
    expect(screen.queryByText("John")).not.toBeInTheDocument();

  });

  test('Filter pets by city', async () => {
    
    (axios.get as any).mockResolvedValue({data: mockPets});

    const user = (userEvent as any).setup();

    render(
      <MemoryRouter>
        <PetListPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Buddy")).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText(/city/i);

    await user.type(input, "London");

    expect(screen.getByText("Buddy")).toBeInTheDocument();
    expect(screen.queryByText("John")).not.toBeInTheDocument();

  });

  test('Filter pets by age', async () => {

    (axios.get as any).mockResolvedValue({data: mockPets});

    const user = (userEvent as any).setup();

    render (
      <MemoryRouter>
        <PetListPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Buddy")).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText(/age/i);

    await user.type(input, "3");

    expect(screen.getByText("Buddy")).toBeInTheDocument();
    expect(screen.queryByText("John")).not.toBeInTheDocument();

  });

});