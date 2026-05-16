const authMiddleware = require('../../middlewares/authMiddleware');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');

jest.mock('jsonwebtoken');
jest.mock('../../models/User');

describe('authMiddleware', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    jest.clearAllMocks();
    mockReq = { headers: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  describe('protect', () => {
    it('should call next when valid token provided', async () => {
      mockReq.headers.authorization = 'Bearer valid-token';
      jwt.verify.mockReturnValue({ id: 'user123' });
      User.findById.mockResolvedValue({ _id: 'user123', name: 'Test', role: 'user' });

      await authMiddleware.protect(mockReq, mockRes, mockNext);

      expect(jwt.verify).toHaveBeenCalledWith('valid-token', process.env.JWT_SECRET);
      expect(User.findById).toHaveBeenCalledWith('user123');
      expect(mockReq.user).toEqual({ _id: 'user123', name: 'Test', role: 'user' });
      expect(mockNext).toHaveBeenCalled();
    });

    it('should return 401 when no token provided', async () => {
      await authMiddleware.protect(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Not authorized, token failed!',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 when token is invalid', async () => {
      mockReq.headers.authorization = 'Bearer invalid-token';
      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await authMiddleware.protect(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 when authorization header format is wrong', async () => {
      mockReq.headers.authorization = 'InvalidFormat token';

      await authMiddleware.protect(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('admin', () => {
    it('should call next when user is admin', () => {
      mockReq.user = { _id: 'user123', role: 'admin' };

      authMiddleware.admin(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should return 403 when user is not admin', () => {
      mockReq.user = { _id: 'user123', role: 'user' };

      authMiddleware.admin(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Not authorized, token failed!',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 403 when user is not set', () => {
      mockReq.user = undefined;

      authMiddleware.admin(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
