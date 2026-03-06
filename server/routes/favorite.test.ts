import request from 'supertest';
import express from 'express';
import { describe, test, expect, vi } from 'vitest';
import router from './favorite'

vi.mock('../middleware/authMiddleware', () => ({
  default: (req:any, res: any, next: any) => next()
}));

vi.mock('../controllers/favoriteController', () => ({
  toggleFavoriteStatus: vi.fn((req,res) => res.status(200).json({message: "Added to Favorites"})),
  getAllFavorites: vi.fn((req,res) => res.status(200).json([{name: "Buddy", favorite: true}]))
}));

const app = express();
app.use(express.json());
app.use('/favorite', router);


describe.only("Favorite routes", () => {

  test('POST /:id/toggle', async () => {

    const res = await request(app).post('/favorite/112/toggle');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({message: "Added to Favorites"});
  });

  test("GET /favorite", async () => {

    const res = await request(app).get('/favorite');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([{name: "Buddy", favorite: true}])
  });

});