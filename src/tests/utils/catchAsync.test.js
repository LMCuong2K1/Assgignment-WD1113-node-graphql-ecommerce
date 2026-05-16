// tests/utils/catchAsync.test.js
const catchAsync = require('../../utils/catchAsync');

describe('catchAsync', () => {
  it('should call next with error when async function throws', async () => {
    // Arrange
    const mockReq = {};
    const mockRes = {};
    const mockNext = jest.fn();
    const testError = new Error('Test error');

    // Function giả lập throw lỗi
    const asyncFn = jest.fn().mockRejectedValue(testError);

    // Act
    const wrapped = catchAsync(asyncFn);
    await wrapped(mockReq, mockRes, mockNext);

    // Assert
    expect(mockNext).toHaveBeenCalledWith(testError);
  });

  it('should NOT call next when function succeeds', async () => {
    const mockReq = {};
    const mockRes = {};
    const mockNext = jest.fn();

    const asyncFn = jest.fn().mockResolvedValue('success');

    const wrapped = catchAsync(asyncFn);
    await wrapped(mockReq, mockRes, mockNext);

    expect(mockNext).not.toHaveBeenCalled();
  });
});