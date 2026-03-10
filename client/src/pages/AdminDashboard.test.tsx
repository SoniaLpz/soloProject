import {render, screen} from '@testing-library/react';
import {describe, test, vi, expect} from 'vitest';
import { userEvent } from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import AdminDashboard from './AdminDashboard.js';

vi.mock('./AdminPetList.js', () => ({
  default: () => <div>Pet Listings</div>
}));

vi.mock('./AdminMessages.js', () => ({
  default: () => <div>Messages</div>
}));


describe('Admin Dashboard', () => {
  
  test('Renders the page', () => {

    render (
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );

    expect(screen.getByText(/Welcome to your dashboard/i)).toBeInTheDocument();
    expect(screen.getByRole("button", {name: /Pet listings/i })).toBeInTheDocument();
    expect(screen.getByRole("button", {name: /Messages/i })).toBeInTheDocument();

  });

  test('Navigates to Pet Listings', async () => {

    const user = userEvent.setup();

    render (
      <MemoryRouter initialEntries={["/dashboard"]}>
        <AdminDashboard />
      </MemoryRouter>
    );

    const button = screen.getByRole("button", {name: /Pet Listings/i});
    await user.click(button);

    expect(await screen.findByText("Pet Listings")).toBeInTheDocument();
  });

  test('Navigates to Messages', async () => {
    
    const user = userEvent.setup();

    render (
      <MemoryRouter initialEntries={["/dashboard"]}>
        <AdminDashboard />
      </MemoryRouter>
    );

    const button = screen.getByRole("button", {name: /Messages/i});
    await user.click(button);

    expect(await screen.findByText("Messages")).toBeInTheDocument;
  });
})