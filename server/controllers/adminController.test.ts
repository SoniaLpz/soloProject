import {expect, test, describe, vi, afterEach} from 'vitest';
import { getAllPets, addPet, editPet, deletePet, getAllMessages } from './adminController'; //import funcs we will test 
import Pet from '../models/pet'; // model used by funcs 
import Message from '../models/Message'; // model used by funcs


// Mock the pet model - when imported vitest replaces it with a mock
vi.mock('../models/pet', () => {
 const save = vi.fn().mockResolvedValue({}); //simulate mongoose .save()
 // Mock constructor for new Pet() and we use function instead of => because we require the this keyword
 const PetMock: any = vi.fn(function (this: any, data) {
  this.save = save; // mocked save method to te instance of this
  Object.assign(this, data) // copy all data being passed to new Pet({})
 });
 // Mock all the methods that exist in the controller funcs
 PetMock.find = vi.fn()
 PetMock.findByIdAndUpdate = vi.fn();
 PetMock.findByIdAndDelete = vi.fn();

 return {default: PetMock} // return mocked model
});

// Mock the message model - again when imported it is replaced by vitest with a mock
vi.mock('../models/Message', () => {
  return {
    default: {
      find: vi.fn() // mock Message.find
    }
  }
});

// Simulate a fake express response object
// Expected express object is res.status(200).json(data) so we simulate one
const mockResponse = () => {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res); //returns the response object so chaining is possible
  res.json = vi.fn().mockReturnValue(res); // sends the JSON response 
  return res;
}
// after each test reset the mocks to prevent issues
afterEach(() => {
  vi.clearAllMocks();
})

describe('GetAllPets', () => {
  test('should return all pets', async () => {

    // fake DB result for testing purposes
    const mockPets = [
      {name: "Buddy", type: "Dog"},
      {name: "Mitt", type: "Cat"}
    ];
    // make the mocked model return the data from the fake DB
    ((Pet as any).find).mockResolvedValue(mockPets);

    const req: any = {}; // fake express req object
    const res = mockResponse(); // fake express res object 

    await getAllPets(req,res); //run the controller func

    expect((Pet as any).find).toHaveBeenCalled(); // check if .find() was called
    expect(res.status).toHaveBeenCalledWith(200); // check if the correct status was returned
    expect(res.json).toHaveBeenCalledWith(mockPets); // check if the response contained the pets 

  });
  // Catch block test case
  test('should return 500 if not successful' , async () => {
    // Simulate an error
    ((Pet as any).find).mockRejectedValue(new Error("Internal Server Error"));

    const req: any = {};
    const res = mockResponse();

    await getAllPets(req,res);

    expect(res.status).toHaveBeenCalledWith(500); //Make sure error message is returned
  })

});

describe('addPet', () => {
  test('should create a new pet', async () => {
    //Fake request object that express would expect from the client 
    const req: any = {
      body: {
        name: "Body",
        type: "Dog",
        age: 3,
        location: {lat: 1, lng: 1},
        image: "buddy.png",
        shelter: "test"
      }
    };
    // fake response object
    const res = mockResponse();

    await addPet(req,res); // run the controller function

    expect(Pet).toHaveBeenCalled(); //check if Pet was called which would mean new pet created 
    expect(res.status).toHaveBeenCalledWith(201); // check that the correct HTTP status was returned

  });
  //catch block test case
  test('should return 400 if not successful', async () => {
    // Req from client with data for new pet to be saved to the DB
    const req: any = {
      body: {
        name: "Body",
        type: "Dog",
        age: 3,
        location: {lat: 1, lng: 1},
        image: "buddy.png",
        shelter: "test"
      }
    };

    const res = mockResponse();
    //simulate a DB error
    const saveMock = vi.fn().mockRejectedValue(new Error("Failed to add pet"));
    //Override the controller so when called it will create an object with failing .save()
    (Pet as any).mockImplementation(function (this: any) {
      this.save = saveMock;
    });

    await addPet(req,res); // Run the controller func

    expect(res.status).toHaveBeenCalledWith(400); // .save() fails so return 400
  })

});

describe('editPet', () => {
  test('should update a pet', async () => {
    // fake pet from DB
    const updatedPet = {name: "Buddy", type: "Dog"};

    //Make it return the fake pet from DB when called
    ((Pet as any).findByIdAndUpdate).mockResolvedValue(updatedPet);

    // Simulate a request from the client
    const req: any = {
      params: {id: "123"},
      body: {name: "Buddy"}
    };
    // Fake response object
    const res = mockResponse();

    await editPet(req,res); // run the controller func

    expect((Pet as any).findByIdAndUpdate).toHaveBeenCalledWith("123", req.body, {new: true}); // make sure correct db call was made
    expect(res.status).toHaveBeenCalledWith(200); // make sure correct HTTP status is returned
    expect(res.json).toHaveBeenCalledWith(updatedPet); // make sure updated pet is returned
  });

  test('should return 400 if unsuccessful', async () => {
    // Force an error
    ((Pet as any).findByIdAndUpdate).mockRejectedValue(new Error("Error updating pet"));
    // data coming from client
    const req: any = {
      params: {id: "123"},
      body: {name: "Buddy"}
    };

    const res = mockResponse();

    await editPet(req,res); //Run controller func

    expect(res.status).toHaveBeenCalledWith(400); // Because it fails, HTTP status 400 should be returned 
  })
});

describe('deletePet', () => {
  test('should delete a pet', async () => {
    //Mock successful deletion
    ((Pet as any).findByIdAndDelete).mockResolvedValue({name: "Buddy"});

    //Request with ped Id
    const req: any = {
      params: {id: "123"}
    };

    const res = mockResponse();

    await deletePet(req,res); // Run controller func 

    expect((Pet as any).findByIdAndDelete).toHaveBeenCalledWith("123"); // Make sure DB method was called 
    expect(res.status).toHaveBeenCalledWith(200); // Make sure correct status was returned

  });
  //catch block test case
  test('should return 404 if pet not found', async () => {
    // Mock not found
    ((Pet as any).findByIdAndDelete).mockResolvedValue(null);

    // Req with pet Id to be removed
    const req: any = {
      params: {id: "123"}
    };

    const res = mockResponse();

    await deletePet(req,res); // Run the controller func

    expect(res.status).toHaveBeenCalledWith(404); //Should return 404 if thats the case 

  });

});

describe('getAllMessages', () => {
  test('should return all messages', async () => {

    // Messaged returned from DB
    const mockMessages = [
      {name: "Chris", message: "I want to adopt this dog"},
      {name: "Lesley", message: "I am interested in Buddy"}
    ];
    // Mock .find() so we can get back the mockMessages
    ((Message as any).find).mockResolvedValue(mockMessages);

    const req: any = {};
    const res = mockResponse();

    await getAllMessages(req, res); // Run the controller func

    expect((Message as any).find).toHaveBeenCalled(); // Make sure .find() was called
    expect(res.status).toHaveBeenCalledWith(200); // Make sure status is the correct one
    expect(res.json).toHaveBeenCalledWith(mockMessages); // Make sure all messages were returned
  });

  test('should return 500 if not successful', async () => {

    ((Message as any).find).mockRejectedValue(new Error("Internal Server Error"));

    const req: any = {};
    const res = mockResponse();

    await getAllMessages(req,res);

    expect(res.status).toHaveBeenCalledWith(500);
  })
});