import {render, screen, waitFor} from '@testing-library/react';
import {describe,test,expect,vi,beforeEach} from 'vitest';
import { userEvent } from '@testing-library/user-event';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import AdminEditPage from './AdminEditPage.js';

vi.mock('axios');
const mockedAxios = axios as any;

const navigateMock = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');

  return {
    ...actual,
    useParams: () => ({id: "1"}),
    useNavigate: () => navigateMock
  };
});

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

const mockPet = {
  name: "Buddy",
  age: 2,
  image: "buddy.png"
};

describe.only("AdminEditPage", () => {
  
  test('Renders form for shelters', async () => {

    localStorage.setItem("role", "shelter");

    mockedAxios.get.mockResolvedValue({data: mockPet});

    render (
      <MemoryRouter>
        <AdminEditPage />
      </MemoryRouter>
    );

    expect(await screen.findByDisplayValue(mockPet.name)).toBeInTheDocument();
    expect(screen.getByDisplayValue(String(mockPet.age))).toBeInTheDocument();
  });

  test('Submits form and navigates', async () => {

    const user = userEvent.setup();

    localStorage.setItem("role", "shelter");
    localStorage.setItem("token", "234");

    mockedAxios.get.mockResolvedValue({data: mockPet});
    mockedAxios.put.mockResolvedValue({});

    render (
      <MemoryRouter>
        <AdminEditPage />
      </MemoryRouter>
    );

    const nameInput = await screen.findByDisplayValue(mockPet.name);
    
    await user.clear(nameInput);
    await user.type(nameInput, "John");

    const submitBtn = screen.getByRole("button", {name: /submit/i });

    await user.click(submitBtn);

    expect(mockedAxios.put).toHaveBeenCalledWith(
      "http://localhost:3000/dashboard/pets/1", 
      expect.objectContaining({name: "John", age: mockPet.age, image: mockPet.image}), 
      expect.any(Object)
    );

    expect(navigateMock).toHaveBeenCalledWith("/pets/1")
  });
  
}) 