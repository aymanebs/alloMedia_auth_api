const generateOtp = require("../../helpers/generateOtp");

describe('generate Otp', () => {
    it('should generate a valid OTP', () => {
        const otp = generateOtp();
        expect(otp).toBeDefined();
        expect(typeof otp).toBe('number');
    });
});
