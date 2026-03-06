import {expect, test, afterEach, vi, describe} from 'vitest';
import { submitContactForm } from './contactController';
import Message from '../models/Message';

vi.mock('../models/Message', () => {

  const save = vi.fn().mockResolvedValue({});
  const MessageMock: any = vi.fn(function (this: any, data) {
    this.save = save;
    Object.assign(this,data);
  });

  return {default: MessageMock};
});

const mockResponse = () => {
  const res: any = {};
  
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);

  return res;
}

afterEach(() => {
  vi.clearAllMocks();
});

describe('submitContactForm', () => {

  test('should save message', async () => {

    const req: any = {
      body: {
        name: "John",
        email: "john@gmail.com",
        message: "I would like to adopt Buddy"
      }
    };

    const res = mockResponse();

    await submitContactForm(req,res);

    expect(Message).toHaveBeenCalledWith({name: "John", email: "john@gmail.com", message: "I would like to adopt Buddy"});
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({message: "Message received and saved"})
  });

  test('should return 500 if unsuccessful', async () => {

    const saveMock = vi.fn().mockRejectedValue(new Error("Internal Server Error"));

    (Message as any).mockImplementation(function (this:any) {
      this.save = saveMock;
    });

    const req: any = {
      body: {
        name: "John",
        email: "john@gmail.com",
        message: "I would like to adopt Buddy"
      }
    };
    const res = mockResponse();

    await submitContactForm(req,res);

    expect(res.status).toHaveBeenCalledWith(500);

  });
})
