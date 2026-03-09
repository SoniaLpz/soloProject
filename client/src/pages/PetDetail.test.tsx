import {render, screen} from '@testing-library/react';
import {describe, test, expect, vi} from 'vitest';
import axios from 'axios';
import PetDetailPage from './PetDetailPage.js';
import { MemoryRouter } from 'react-router-dom';
import {userEvent} from '@testing-library/user-event';

// mock axios so that calls to real DB are not made
vi.mock('axios');
const mockedAxios = axios as any;
//mocked navigate func
const navigateMock = vi.fn();

//mock useParams and useNavigate from react router
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');

  return {
    ...actual,
    useParams: () => ({id: "1"}),
    useNavigate: () => navigateMock
  };
});

//Mock pet
const mockPet = {
  _id: "1",
  name: "Buddy",
  type: "Dog",
  age: 2,
  shelterName: "Us",
  phone: "12345",
  email: "us@gmail.com",
  image: "buddy.png",
  location: {lat: 51.5, lng: -0.1}
};
// mock localStorage
let storage: Record<string, string> = {};

beforeEach(() => {
  vi.clearAllMocks(); //reset mocks
  storage = {}; // reset localStorage
  //fake implementation of localStorage to access methods
  window.localStorage = {
    getItem: (key: string) => storage[key] || null,
    setItem: (key: string, value: string) => {
      storage[key] = value;
    },
    removeItem: (key: string) => {
      delete storage[key];
    },
    clear: () => {
      storage = {};
    }
  } as any;
});

describe('PetDetailPage', () => {

  test('Displays pet details', async () => {
    mockedAxios.get
    .mockResolvedValueOnce({data: mockPet})
    .mockResolvedValueOnce({data: {address: {city: "London"}}})
    .mockResolvedValueOnce({data: []})

    render (
      <MemoryRouter>
        <PetDetailPage />
      </MemoryRouter>
    );
    //Expected info on pet details page
    expect(await screen.findByText("Buddy")).toBeInTheDocument();
    expect(screen.getByText(/age/i)).toBeInTheDocument();
    expect(screen.getByText("Us")).toBeInTheDocument();
    expect(screen.getByText("London")).toBeInTheDocument();

  });

  test('Displays favorite icon for adopters', async () => {

    localStorage.setItem("token", "345");
    localStorage.setItem("role", "adopter");

    mockedAxios.get
    .mockResolvedValueOnce({data: mockPet})
    .mockResolvedValueOnce({data: {address: {city: "London"}}})
    .mockResolvedValueOnce({data: []})

    render (
      <MemoryRouter>
        <PetDetailPage />
      </MemoryRouter>
    )
    //if an adopter opens pet details they should be able to add it to favorites
    expect(await screen.findByText(/heart this pet/i)).toBeInTheDocument();
  });

  test('Displays admin buttons for shelters', async () => {

    localStorage.setItem("token", "345");
    localStorage.setItem("role", "shelter");

    mockedAxios.get
    .mockResolvedValueOnce({data: mockPet})
    .mockResolvedValueOnce({data: {address: {city: "London"}}})
    .mockResolvedValueOnce({data: []})

    render (
      <MemoryRouter>
        <PetDetailPage />
      </MemoryRouter>
    );
    //if a shelter open pet details they should see edit and delete buttons
    const buttons = await screen.findAllByRole("button");
    expect(buttons.length).toBeGreaterThan(1);

  });

  test("Toggles favorite", async () => {
    const user = userEvent.setup();

    localStorage.setItem("token", "345");
    localStorage.setItem("role", "adopter");

    mockedAxios.get
    .mockResolvedValueOnce({data: mockPet})
    .mockResolvedValueOnce({data: {address: {city: "London"}}})
    .mockResolvedValueOnce({data: []})
    //if user adds pet to favorites we reflect the change in the DB - switch boolean flag
    mockedAxios.post.mockResolvedValue({data: {pet: {favorite: true}}});

    render (
      <MemoryRouter>
        <PetDetailPage />
      </MemoryRouter>
    );

    const button = await screen.findByRole("button");

    await user.click(button); //trigers handleFavoriteToggle()

    //url,req.body,object(authorization: "bearer")
    expect(mockedAxios.post).toHaveBeenCalledWith("http://localhost:3000/favorite/1/toggle", {}, expect.any(Object));

  });
  
})

