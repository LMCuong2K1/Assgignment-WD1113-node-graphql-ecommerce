// tests/utils/response.test.js
const { success } = require('../../utils/response');

describe('response.success', () => {
  // Mock res object
  let mockRes;

  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockReturnThis(), // chain: res.status().json()
      json: jest.fn().mockReturnThis(),
    };
  });

  it('should return success with data', () => {
    // Arrange
    const data = { id: 1, name: 'Product' };

    // Act
    success(mockRes, { data });

    // Assert
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: true,
      data: { id: 1, name: 'Product' },
    });
  });

  it('should return success with message', () => {
    success(mockRes, { message: 'Created successfully', statusCode: 201 });

    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: true,
      message: 'Created successfully',
    });
  });

  it('should include count when provided', () => {
    success(mockRes, { data: [1, 2, 3], count: 3 });

    expect(mockRes.json).toHaveBeenCalledWith({
      success: true,
      data: [1, 2, 3],
      count: 3,
    });
  });

  it('should include extra fields', () => {
    success(mockRes, {
      data: { id: 1 },
      pagination: { page: 1, limit: 10 },
    });

    expect(mockRes.json).toHaveBeenCalledWith({
      success: true,
      data: { id: 1 },
      pagination: { page: 1, limit: 10 },
    });
  });
});