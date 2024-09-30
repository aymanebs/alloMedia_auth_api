const { verifyOtp } = require("../AuthController");


describe('verifyOtp', () => {
  it('should return success message and token on valid OTP', () => {
    const req = { body: { userId: '123', otp: '123456' }, session: { otp: '123456', otpExpires: Date.now() + 300000 } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    const token = verifyOtp(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
        token: expect.any(String), 
        message: 'Login successful',
    });
    
  });

  it('should return error message for invalid OTP', () => {
    const req = { body: { userId: '123', otp: 'wrongOtp' }, session: { otp: '123456', otpExpires: Date.now() + 300000 } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    verifyOtp(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'entered otp invalid' });
  });
});
