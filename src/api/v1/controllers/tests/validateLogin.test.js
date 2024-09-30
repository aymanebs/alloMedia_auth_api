const validateLogin = require("../../middlewares/validateLogin");
const httpMocks = require("node-mocks-http");

describe('Validate login inputs function', () => {
  
  it("Should return status 400 if email or password is missing or invalid", async () => {
    const req = httpMocks.createRequest({
      method: "POST",
      body: {
        email: "ahmad@gmail.com",
        password: "",  // Missing password
      },
    });
    
    const res = httpMocks.createResponse();
    const next = jest.fn();
    
    await validateLogin(req, res, next);
    
    expect(res.statusCode).toBe(400);
    expect(next).not.toHaveBeenCalled();
  });

  it("Should call next if inputs are valid", async () => {
    const req = httpMocks.createRequest({
      method: "POST",
      body: {
        email: "ahmad@gmail.com",
        password: "aA12345678",
      },
    });
    
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await validateLogin(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
