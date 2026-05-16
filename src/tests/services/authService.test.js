const authService = require('../../services/authService');
const User = require('../../models/User');
const Cart = require('../../models/Cart');
const jwt = require('../../utils/jwt');
const AppError = require('../../utils/AppError');

jest.mock('../../models/User');
jest.mock('../../models/Cart');
jest.mock('../../utils/jwt');

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register new user successfully', async () => {
      const userInfo = {
        name: 'Test User',
        email: 'test@example.com',
        password: '123456',
      };
      const mockUser = { _id: '665a1b2c3d4e5f6a7b8c9d0e', ...userInfo };
      const mockToken = 'fake.jwt.token';

      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue(mockUser);
      Cart.create.mockResolvedValue({ _id: 'cart123', user: mockUser._id, items: [] });
      jwt.generateToken.mockReturnValue(mockToken);

      const result = await authService.register(userInfo);

      expect(User.findOne).toHaveBeenCalledWith({ email: userInfo.email });
      expect(User.create).toHaveBeenCalledWith(userInfo);
      expect(Cart.create).toHaveBeenCalledWith({ user: mockUser._id, items: [] });
      expect(jwt.generateToken).toHaveBeenCalledWith(mockUser._id);
      expect(result).toEqual({ user: mockUser, token: mockToken });
    });

    it('should throw 409 if email already exists', async () => {
      const userInfo = { email: 'exists@example.com', password: '123456' };
      User.findOne.mockResolvedValue({ email: 'exists@example.com' });

      await expect(authService.register(userInfo)).rejects.toThrow(AppError);
      await expect(authService.register(userInfo)).rejects.toThrow('Email đã được sử dụng!');
    });
  });

  describe('login', () => {
    it('should login successfully with correct credentials', async () => {
      const userInfo = { email: 'user@test.com', password: '123456' };
      const mockUser = {
        _id: '665a1b2c3d4e5f6a7b8c9d0e',
        email: 'user@test.com',
        matchPassword: jest.fn().mockResolvedValue(true),
      };
      const mockToken = 'fake.jwt.token';

      User.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue(mockUser) });
      jwt.generateToken.mockReturnValue(mockToken);

      const result = await authService.login(userInfo);

      expect(result).toEqual({ user: mockUser, token: mockToken });
      expect(mockUser.matchPassword).toHaveBeenCalledWith('123456');
    });

    it('should throw 401 if user not found', async () => {
      User.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue(null) });

      await expect(authService.login({ email: 'no@test.com', password: '123' }))
        .rejects.toThrow('Email hoặc mật khẩu không đúng!');
    });

    it('should throw 401 if password is wrong', async () => {
      const mockUser = { matchPassword: jest.fn().mockResolvedValue(false) };
      User.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue(mockUser) });

      await expect(authService.login({ email: 'user@test.com', password: 'wrong' }))
        .rejects.toThrow('Email hoặc mật khẩu không đúng!');
    });
  });

  describe('getProfile', () => {
    it('should return user if found', async () => {
      const mockUser = { _id: '665a1b2c3d4e5f6a7b8c9d0e', name: 'Test' };
      User.findById.mockResolvedValue(mockUser);

      const result = await authService.getProfile('665a1b2c3d4e5f6a7b8c9d0e');

      expect(User.findById).toHaveBeenCalledWith('665a1b2c3d4e5f6a7b8c9d0e');
      expect(result).toEqual(mockUser);
    });

    it('should throw 404 if user not found', async () => {
      User.findById.mockResolvedValue(null);

      await expect(authService.getProfile('invalid-id'))
        .rejects.toThrow('Không tìm thấy user!');
    });
  });

  describe('updateProfile', () => {
    it('should update and return user', async () => {
      const mockUser = { _id: '665a1b2c3d4e5f6a7b8c9d0e', name: 'Updated' };
      User.findByIdAndUpdate.mockResolvedValue(mockUser);

      const result = await authService.updateProfile('665a1b2c3d4e5f6a7b8c9d0e', { name: 'Updated' });

      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        '665a1b2c3d4e5f6a7b8c9d0e',
        { name: 'Updated' },
        { returnDocument: 'after', runValidators: true }
      );
      expect(result).toEqual(mockUser);
    });

    it('should throw 404 if user not found', async () => {
      User.findByIdAndUpdate.mockResolvedValue(null);

      await expect(authService.updateProfile('invalid-id', { name: 'Test' }))
        .rejects.toThrow('Không tìm thấy user!');
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const mockUsers = [
        { _id: '1', name: 'User1' },
        { _id: '2', name: 'User2' },
      ];
      User.find.mockResolvedValue(mockUsers);

      const result = await authService.getAllUsers();

      expect(User.find).toHaveBeenCalledWith({});
      expect(result).toEqual(mockUsers);
    });

    it('should return empty array if no users', async () => {
      User.find.mockResolvedValue([]);

      const result = await authService.getAllUsers();

      expect(result).toEqual([]);
    });
  });

  describe('getUserById', () => {
    it('should return user if found', async () => {
      const mockUser = { _id: '665a1b2c3d4e5f6a7b8c9d0e', name: 'Test' };
      User.findById.mockResolvedValue(mockUser);

      const result = await authService.getUserById('665a1b2c3d4e5f6a7b8c9d0e');

      expect(result).toEqual(mockUser);
    });

    it('should throw 404 if user not found', async () => {
      User.findById.mockResolvedValue(null);

      await expect(authService.getUserById('invalid-id'))
        .rejects.toThrow('Không tìm thấy user!');
    });
  });

  describe('updateUserByAdmin', () => {
    it('should update user and save', async () => {
      const mockUser = {
        _id: '665a1b2c3d4e5f6a7b8c9d0e',
        name: 'Old',
        save: jest.fn().mockResolvedValue({ _id: '665a1b2c3d4e5f6a7b8c9d0e', name: 'New' }),
      };
      User.findById.mockResolvedValue(mockUser);

      const result = await authService.updateUserByAdmin('665a1b2c3d4e5f6a7b8c9d0e', { name: 'New' });

      expect(mockUser.name).toBe('New');
      expect(mockUser.save).toHaveBeenCalled();
    });

    it('should throw 404 if user not found', async () => {
      User.findById.mockResolvedValue(null);

      await expect(authService.updateUserByAdmin('invalid-id', { name: 'Test' }))
        .rejects.toThrow('Không tìm thấy user!');
    });
  });
});
