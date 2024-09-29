const emailCheck = require('../../middlewares/emailCheck');
const httpMocks = require('node-mocks-http');
const User = require('../../models/User'); 

jest.mock('../../models/User'); 

describe('Check if email is already used function', () => {
  it('Should return 400 if email already exists', async () => {
    // Mock the findOne 
    User.findOne.mockResolvedValue({ email: 'ahmad@gmail.com' });

    const req = httpMocks.createRequest({
      method: 'POST',
      body: { email: 'ahmad@gmail.com' },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await emailCheck(req, res, next);

    expect(res.statusCode).toBe(400); 
    expect(next).not.toHaveBeenCalled(); 
    expect(res._getJSONData()).toEqual({ message: 'email already registered' });
  });

  it('Should call next if email is not used', async () => {
    // Mock the findOne method 
    User.findOne.mockResolvedValue(null);

    const req = httpMocks.createRequest({
      method: 'POST',
      body: { email: 'ahmad@gmail.com' },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await emailCheck(req, res, next);

    expect(next).toHaveBeenCalled(); 
    expect(res.statusCode).toBe(200); 
  });
});
