import request from 'supertest';
import express from 'express';
import { describe, test, expect, vi } from 'vitest';
import router from './dashboard';

vi.mock('../middleware/authMiddleware', () => ({
  default: (req:any, res: any, next: any) => next()
}));

vi.mock('../controllers/adminController', () => ({
  getAllPets: vi.fn((req,res) => res.status(200).json({pets: []})),
  addPet: vi.fn((req,res) => res.status(201).json({message: "Pet added"})),
  editPet: vi.fn((req,res) => res.status(200).json({message: "Pet updated"})),
  deletePet: vi.fn((req,res) => res.status(200).json({message: "Pet deleted"})),
  getAllMessages: vi.fn((req,res) => res.status(200).json({messages: []})),
}));

const app = express();
app.use(express.json());
app.use('/dashboard', router);

describe('Dashboard routes', () => {

  test('GET pets', async () => {
    const res = await request(app).get('/dashboard/pets');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({pets: [] });
  });

  test('POST list', async () => {

    const res = await request(app).post('/dashboard/list').send({name: "Buddy", type: "Dog"});

    expect(res.status).toBe(201);
    expect(res.body).toEqual({message: "Pet added"});
  });

  test('PUT pets/:id', async () => {

    const res = await request(app).put('/dashboard/pets/112').send({name: "George"});

    expect(res.status).toBe(200);
    expect(res.body).toEqual({message: "Pet updated"})
  });

  test('DELETE pets/:id', async () => {

    const res = await request(app).delete('/dashboard/pets/112');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({message: "Pet deleted"});
  });

  test('GET messages', async () => {

    const res = await request(app).get('/dashboard/messages');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({messages: [] });
  });

});