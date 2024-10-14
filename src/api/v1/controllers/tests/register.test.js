const { register } = require("./../AuthController"); 
const User = require('../../models/User'); 
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendingMail } = require("../../services/mailing");
const httpMocks = require("node-mocks-http");

jest.mock('../../models/User'); 
jest.mock("bcryptjs"); 
jest.mock("jsonwebtoken");
jest.mock("../../services/mailing"); 

// Mock environment variable
process.env.JWT_SECRET = "mockedSecret"; 

describe("Register function", () => {
  beforeEach(() => {
    // Silence console.error
    jest.spyOn(console, 'error').mockImplementation(() => {}); 
    jest.clearAllMocks();
  });

  it("should successfully register a user", async () => {
    const req = httpMocks.createRequest({
      method: "POST",
      body: {name: "Ahmad", email: "ahmad@gmail.com", password: "aA12345678", address: "location", phone: "2128766546"},
    });
    const res = httpMocks.createResponse();

    bcrypt.hash.mockResolvedValue("hashedPassword");

    User.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue({
        _id: "userId",
        name: "Ahmad",
        email: "ahmad@gmail.com",
        address: "location",
        phone: "2128766546",
      }),
    }));

    jwt.sign.mockReturnValue("mockedToken");

    sendingMail.mockResolvedValue();

    await register(req, res);

    expect(res.statusCode).toBe(200); 
    const data = res._getData();
    expect(data).toEqual({
      _id: "userId",
      name: "Ahmad",
      email: "ahmad@gmail.com",
      address: "location",
      phone: "2128766546",
    });

    expect(jwt.sign).toHaveBeenCalledWith({ userId: "userId" }, "mockedSecret", { expiresIn: "1h" });
    expect(sendingMail).toHaveBeenCalledWith(expect.objectContaining({
      to: "ahmad@gmail.com",
      subject: "Account Verification Link",
    }));
  });

  it("should return 500 if user registration fails", async () => {
    const req = httpMocks.createRequest({
      method: "POST",
      body: {name: "Ahmad", email: "ahmad@gmail.com", password: "aA12345678", address: "location", phone: "2128766546"},
    });
    const res = httpMocks.createResponse();

    bcrypt.hash.mockResolvedValue("hashedPassword");

    User.mockImplementation(() => ({
      save: jest.fn().mockRejectedValue(new Error("Registration failed")),
    }));

    await register(req, res);

    expect(res.statusCode).toBe(500);
    const data = JSON.parse(res._getData());
    expect(data).toEqual({ error: "Registration failed" });
  });
});
