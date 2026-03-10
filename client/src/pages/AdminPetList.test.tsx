import {render, screen, waitFor} from '@testing-library/react';
import {describe,expect,test,vi,beforeEach} from 'vitest';
import { userEvent } from '@testing-library/user-event';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import AdminPetList from './AdminPetList.js';


vi.mock('axios');
const mockedAxios = axios as any;

vi.mock('../components/PetCard.js', () => ({
  default: ({pet}: any) => <div>{pet.name}</div>
}));

let storage: Record<string,string> = {};

beforeEach(() => {
  vi.clearAllMocks();
  storage = {};
  window.localStorage = {
    getItem: (key: string) => storage[key] || null,
    setItem: (key: string, value: string) => {storage[key] = value},
    removeItem: (key: string) => {delete storage[key]},
    clear: () => {storage = {}}
  } as any;
});

const mockPets = [
  {
    _id: "1",
    name: "Buddy",
    type: "Dog",
    gender: "Male",
    shelterName: "Us",
    phone: "12345",
    email: "us@gmail.com",
    age: "2",
    location: "London"
  },
  {
    _id: "2",
    name: "John",
    type: "Cat",
    gender: "Female",
    shelterName: "You",
    phone: "23456",
    email: "you@gmail.com",
    age: "1",
    location: "Reading"
  }
];

describe("AdminPetList", () => {

  test("Fetch and display pets", async () => {

    storage.token = "234";
    storage.role = "shelter";

    mockedAxios.get.mockResolvedValue({data: mockPets});

    render (
      <MemoryRouter>
        <AdminPetList />
      </MemoryRouter>
    );

    expect(await screen.findByText(mockPets[0]!.name)).toBeInTheDocument();
    expect(screen.getByText(mockPets[1]!.name)).toBeInTheDocument();
  });

  test("New Pet button for shelters", async () => {

    storage.role = "shelter";

    mockedAxios.get.mockResolvedValue({data: []});

    render (
      <MemoryRouter>
        <AdminPetList />
      </MemoryRouter>
    );

    expect(screen.getByRole("button", {name: /New Pet/i})).toBeInTheDocument();
  });

  test("Submits new pet form", async () => {

    const user = userEvent.setup();

    storage.token = "234";
    storage.role = "shelter";

    mockedAxios.get.mockResolvedValue({data: []});

    mockedAxios.post
    .mockResolvedValueOnce({
      data: [{lat: "51", lon: "0"}]
    })
    .mockResolvedValueOnce({
      data: [{_id: "3", name: "Milo"}]
    });

    render(
      <MemoryRouter>
        <AdminPetList />
      </MemoryRouter>
    );
    await user.click(screen.getByRole("button", {name: /New Pet/i}));

    const nameInput = screen.getByPlaceholderText("Name") as HTMLInputElement;
    const typeInput = screen.getByPlaceholderText("Type (e.g., Dog, Cat)") as HTMLInputElement;
    const genderInput = screen.getByPlaceholderText("Gender") as HTMLInputElement;
    const shelterInput = screen.getByPlaceholderText("Shelter") as HTMLInputElement;
    const contactNumInput = screen.getByPlaceholderText("Contact Number") as HTMLInputElement;
    const emailInput = screen.getByPlaceholderText("Email") as HTMLInputElement;
    const ageInput = screen.getByPlaceholderText("Age") as HTMLInputElement;
    const cityInput = screen.getByPlaceholderText("City Name") as HTMLInputElement;


    await user.type(nameInput, mockPets[0]!.name);
    await user.type(typeInput, mockPets[0]!.type);
    await user.type(genderInput, mockPets[0]!.gender);
    await user.type(shelterInput, mockPets[0]!.shelterName);
    await user.type(contactNumInput, mockPets[0]!.phone);
    await user.type(emailInput, mockPets[0]!.email);
    await user.type(ageInput, mockPets[0]!.age);
    await user.type(cityInput, mockPets[0]!.location);

    expect(nameInput.value).toBe(mockPets[0]!.name);
    expect(typeInput.value).toBe(mockPets[0]!.type);
    expect(genderInput.value).toBe(mockPets[0]!.gender);
    expect(shelterInput.value).toBe(mockPets[0]!.shelterName);
    expect(contactNumInput.value).toBe(mockPets[0]!.phone);
    expect(emailInput.value).toBe(mockPets[0]!.email);
    expect(ageInput.value).toBe(mockPets[0]!.age);
    expect(cityInput.value).toBe(mockPets[0]!.location);

    const submitBtn = screen.getByRole("button", {name: /Submit/i});
    await user.click(submitBtn);

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalled();
    });
  });
});