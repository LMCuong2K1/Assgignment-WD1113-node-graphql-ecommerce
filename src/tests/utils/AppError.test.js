const AppError = require("../../utils/AppError");

describe('AppError',()=>{
    //test constructor
    it('should create error with message and statusCode',()=>{
        const message = 'User not found';
        statusCode = 404;

        const error = new AppError(message,statusCode);
        expect(error.message).toBe(message);
        expect(error.statusCode).toBe(statusCode);
        expect(error.isOperational).toBe(true);
    })

    //test kế thừa từ Error
    it('should ne instance of Error',()=>{
        const error = new AppError('Test',500);
        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(AppError);
    })

    //test các statusCode khác
    it('should handle different status code',()=>{
        expect(new AppError('Bad request',400).statusCode).toBe(400);
        expect(new AppError('Unauthorize',401).statusCode).toBe(401);
        expect(new AppError('Conflict',409).statusCode).toBe(409);
    })
})