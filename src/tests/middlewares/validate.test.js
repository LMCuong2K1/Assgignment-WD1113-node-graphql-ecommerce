const validate = require('../../middlewares/validate');
const { z } = require('zod');

describe('validate middleware', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = { body: {}, query: {}, params: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  it('should call next when validation passes', () => {
    const schema = z.object({
      body: z.object({ name: z.string() }),
    });
    mockReq.body = { name: 'Test' };

    const middleware = validate(schema);
    middleware(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockRes.status).not.toHaveBeenCalled();
  });

  it('should return 400 when validation fails', () => {
    const schema = z.object({
      body: z.object({ name: z.string() }),
    });
    mockReq.body = {};

    const middleware = validate(schema);
    middleware(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: 'Dữ liệu không hợp lệ',
      errors: expect.arrayContaining([
        expect.objectContaining({ field: expect.any(String), error: expect.any(String) }),
      ]),
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should validate query parameters', () => {
    const schema = z.object({
      query: z.object({ page: z.coerce.number() }),
    });
    mockReq.query = { page: '2' };

    const middleware = validate(schema);
    middleware(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });

  it('should validate params', () => {
    const schema = z.object({
      params: z.object({ id: z.string() }),
    });
    mockReq.params = { id: '123' };

    const middleware = validate(schema);
    middleware(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });

  it('should handle multiple validation errors', () => {
    const schema = z.object({
      body: z.object({
        name: z.string(),
        email: z.string().email(),
      }),
    });
    mockReq.body = { name: 123, email: 'invalid' };

    const middleware = validate(schema);
    middleware(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    const response = mockRes.json.mock.calls[0][0];
    expect(response.errors.length).toBeGreaterThanOrEqual(2);
  });
});
