import { vi, describe, it, expect } from 'vitest';
import Pet from '../models/pet'; 
import { Request, Response } from 'express';
import {getAllPets, addPet, getOnePet} from '../controllers/petController';

vi.mock('../models/pet', () => {
  const mockPet = vi.fn(function (data) { 
    return {
        ...data, 
    save: vi.fn().mockResolvedValue({ _id: '123', ...data })
    };

});

  return {
    default: Object.assign(mockPet, {
      find: vi.fn(),
      findById: vi.fn(), 
      create: vi.fn().mockImplementation((data) => Promise.resolve({ _id: '123', ...data })),
    })
  };
});

describe('getAllPets', () => {
it('GET /return a list of all pets', async () => {
     const mockData = [{ name: 'Buddy' }, { name: 'Luci' }];
     (Pet.find as any).mockResolvedValue(mockData);

    const req = {} as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis()
    } as unknown as Response;
    
    await getAllPets(req, res);
     expect(res.json).toHaveBeenCalledWith(mockData);
})
}); 

describe('AddPets', () => {
it('add a new animal to the list', async () => {
    const mockData = { name: 'Buddy', type: 'dog' };
    
    const req = {body: mockData} as any;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    } as any;
    
    
    await addPet(req, res);
    expect(Pet).toHaveBeenCalledWith(mockData);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({name: 'Buddy', type: 'dog'}));
})

}); 

describe('getOnePet', () => {
it('details for one pet', async () => {
    const mockData = {_id: '123', name: 'Buddy', type: 'dog', "shelter": undefined };
    vi.mocked(Pet.findById).mockResolvedValue(mockData);
    
    const req = {params: { id: '123' }} as any;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    } as any;
    
    await getOnePet(req, res);
    expect(Pet.findById).toHaveBeenCalledWith('123');
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining(mockData));
})

});










