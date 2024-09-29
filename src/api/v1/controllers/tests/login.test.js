const { login } = require("./../AuthController");
const User = require('../../models/User');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const httpMocks = require("node-mocks-http");

jest.mock('../../models/User');
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("Login function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully log in a user and return a token", async () => {
    const req = httpMocks.createRequest({
      method: "POST",
      body: { email: "ahmad@gmail.com", password: "aA12345678" },
    });
    const res = httpMocks.createResponse();

    
    const user = {
      _id: "userId",
      emailIsVerified: true,
      password: "hashedPassword",
    };

    User.findOne.mockResolvedValue(user);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("mockedToken");

    await login(req, res);

    expect(res.statusCode).toBe(200);
    const data = JSON.parse(res._getData()); 
    expect(data).toEqual({  message: "Login successful", token: "mockedToken", });
    expect(jwt.sign).toHaveBeenCalledWith(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
  });

  it("should return 400 if user is not found", async () => {
    const req = httpMocks.createRequest({
      method: "POST",
      body: { email: "ahmad@gmail.com", password: "aA12345678" },
    });
    const res = httpMocks.createResponse();

    User.findOne.mockResolvedValue(null);

    await login(req, res);

    expect(res.statusCode).toBe(400);
    const data = JSON.parse(res._getData());
    expect(data).toEqual({ message: "Invalid email or password" });
  });

  it("should return 403 if email is not verified", async () => {
    const req = httpMocks.createRequest({
      method: "POST",
      body: { email: "ahmad@gmail.com", password: "aA12345678" },
    });
    const res = httpMocks.createResponse();

   
    const user = {
      _id: "userId",
      emailIsVerified: false,
      password: "hashedPassword",
    };

    User.findOne.mockResolvedValue(user);

    await login(req, res);

    expect(res.statusCode).toBe(403);
    const data = JSON.parse(res._getData());
    expect(data).toEqual({ message: "Please verify your email before logging in" });
  });

  it("should return 400 if password is invalid", async () => {
    const req = httpMocks.createRequest({
      method: "POST",
      body: { email: "ahmad@gmail.com", password: "wrongPassword" },
    });
    const res = httpMocks.createResponse();

    
    const user = {
      _id: "userId",
      emailIsVerified: true,
      password: "hashedPassword",
    };

    User.findOne.mockResolvedValue(user);
    bcrypt.compare.mockResolvedValue(false);

    await login(req, res);

    expect(res.statusCode).toBe(400);
    const data = JSON.parse(res._getData());
    expect(data).toEqual({ message: "Invalid email or password" });
  });

  it("should return 500 if there is a server error", async () => {
    const req = httpMocks.createRequest({
      method: "POST",
      body: { email: "ahmad@gmail.com", password: "aA12345678" },
    });
    const res = httpMocks.createResponse();

   
    User.findOne.mockImplementation(() => {
      throw new Error("Database error");
    });

    await login(req, res);

    expect(res.statusCode).toBe(500);
    const data = JSON.parse(res._getData());
    expect(data).toEqual({ message: "Server error" });
  });
});
