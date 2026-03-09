import { vi, describe, it, expect } from 'vitest';
import type { Request, Response } from 'express'
import request from 'supertest'
import { register, login} from '../controllers/authController'


vi.mock('../models/pet', () => {
  const mockAuth = vi.fn(function (data) { 
    return {
        ...data, 
    save: vi.fn().mockResolvedValue({ })
    };

});

  return {
    default: Object.assign(mockAuth, { 
      create: vi.fn().mockImplementation((data) => Promise.resolve({ })),
    })
  };
});

const SECONDS = 1000;

describe('POST-REGISTER', () => {
    it('register accepted', async () => {
      const req = {body: {
        email: "test@example.com",
        password: "12345",
        role: "adopter"
      }} as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    } as unknown as Response;
    
    await register(req, res);
    expect(res.json).toHaveBeenCalled();
    }, 70 * SECONDS)
  }); 

  describe('POST-LOGIN', () => {
    it('login accepted', async () => {
      const req = {body: {
        email: "test@example.com",
        password: "12345"
      }} as unknown as Request;
    
      const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    } as unknown as Response;
    
    await login(req, res);
    expect(res.json).toHaveBeenCalled();
    }, 70 * SECONDS)
  }); 