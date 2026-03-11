import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import App from './App.js'; 
import ContactPage from './pages/ContactPage.js';
import HomePage from './pages/HomePage.js';
import {userEvent} from '@testing-library/user-event';

describe('Route App', async () => {
  it('should allow you to navigate to contact page', async () => {
    render(
        <MemoryRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/contact" element={<ContactPage />} />
            </Routes>
        </MemoryRouter>
        )
    
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', {name : 'Contact Us'}))
    expect("/contact").toEqual("/contact"); 
  })

}); 