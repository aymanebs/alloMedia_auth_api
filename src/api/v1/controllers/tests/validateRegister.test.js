const  validateRegister = require("../../middlewares/validateRegister");
const httpMocks = require("node-mocks-http");


describe('Validate register inputs function',() =>{
    it("Should return status 400 if any input is invalid", async () =>{
        const req =httpMocks.createRequest({
            method:"POST",
            body:{name:"Ahmad",email:"ahmad@gmail.com",address:"location",password:"",confirm_password:"",phone:"2128766546"},
        });
        
        const res=httpMocks.createResponse();
        const next = jest.fn();
        await validateRegister(req,res,next);
        expect(res.statusCode).toBe(400);
        expect(next).not.toHaveBeenCalled();

    });

    it("Should return next if inputs are valid",async ()=>{
        const req =httpMocks.createRequest({
            method:"Post",
            body:{name:"Ahmad",email:"ahmad@gmail.com",password:"aA123!abc!",confirm_password:"aA123!abc!",address:"location",phone:"2128766546"}
        });

        const res =httpMocks.createResponse();
        const next = jest.fn();

        await validateRegister(req,res,next);
        expect(next).toHaveBeenCalled();

    })
});