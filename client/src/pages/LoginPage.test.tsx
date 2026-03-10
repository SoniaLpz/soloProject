import { vi, describe, it, expect } from 'vitest';
import LoginPage from './LoginPage.js'; 
import { render, screen} from '@testing-library/react'; 
import {userEvent} from '@testing-library/user-event'; 
import '@testing-library/jest-dom'; 
import {setupServer} from 'msw/node'; 
import {http, HttpResponse} from 'msw'; 
import { MemoryRouter } from 'react-router-dom';

const server = setupServer(
  http.post('/auth/login', () => {
    return HttpResponse.json({message: 'Login successful'})
  }),
)

  beforeAll(() => server.listen()) 
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

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
 

it('Login successful', async () => { 
  render(
    <MemoryRouter>
     <LoginPage />
   </MemoryRouter>
 );


  const user = userEvent.setup();

  const submit = screen.getByRole('button', {name: "Log In"})
  await user.click(submit); 

}); 
 