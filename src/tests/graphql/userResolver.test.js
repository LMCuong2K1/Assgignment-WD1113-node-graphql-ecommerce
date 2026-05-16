const userResolver = require('../../graphql/resolvers/userResolver');
const authService = require('../../services/authService');

jest.mock('../../services/authService');

describe('userResolver', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Query.me', () => {
    it('should return current user profile', async () => {
      const mockUser = { _id: 'user1', name: 'Test', email: 'test@test.com' };
      authService.getProfile.mockResolvedValue(mockUser);
      const context = { user: { _id: 'user1', role: 'user' } };

      const result = await userResolver.Query.me({}, {}, context);

      expect(result).toEqual(mockUser);
      expect(authService.getProfile).toHaveBeenCalledWith('user1');
    });

    it('should throw error when not logged in', async () => {
      const context = { user: null };

      await expect(userResolver.Query.me({}, {}, context))
        .rejects.toThrow('Bạn chưa đăng nhập!');
    });
  });

  describe('Query.users', () => {
    it('should return all users when admin', async () => {
      const mockUsers = [{ _id: '1', name: 'User1' }];
      authService.getAllUsers.mockResolvedValue(mockUsers);
      const context = { user: { role: 'admin' } };

      const result = await userResolver.Query.users({}, {}, context);

      expect(result).toEqual(mockUsers);
    });

    it('should throw error when not admin', async () => {
      const context = { user: { role: 'user' } };

      await expect(userResolver.Query.users({}, {}, context))
        .rejects.toThrow('Bạn không có quyền thực hiện chức năng này!');
    });
  });

  describe('Query.user', () => {
    it('should return user by id when admin', async () => {
      const mockUser = { _id: '665a1b2c3d4e5f6a7b8c9d0e', name: 'User1' };
      authService.getUserById.mockResolvedValue(mockUser);
      const context = { user: { role: 'admin' } };

      const result = await userResolver.Query.user(
        {},
        { id: '665a1b2c3d4e5f6a7b8c9d0e' },
        context
      );

      expect(result).toEqual(mockUser);
    });

    it('should throw error when not admin', async () => {
      const context = { user: { role: 'user' } };

      await expect(
        userResolver.Query.user({}, { id: '665a1b2c3d4e5f6a7b8c9d0e' }, context)
      ).rejects.toThrow('Bạn không có quyền thực hiện chức năng này!');
    });
  });

  describe('Mutation.register', () => {
    it('should register new user', async () => {
      const mockResult = { user: { _id: '1' }, token: 'fake-token' };
      authService.register.mockResolvedValue(mockResult);

      const result = await userResolver.Mutation.register(
        {},
        { input: { name: 'Test', email: 'test@test.com', password: 'password123' } }
      );

      expect(result).toEqual(mockResult);
    });
  });

  describe('Mutation.login', () => {
    it('should login user', async () => {
      const mockResult = { user: { _id: '1' }, token: 'fake-token' };
      authService.login.mockResolvedValue(mockResult);

      const result = await userResolver.Mutation.login(
        {},
        { input: { email: 'test@test.com', password: 'password123' } }
      );

      expect(result).toEqual(mockResult);
    });
  });

  describe('Mutation.updateProfile', () => {
    it('should update user profile', async () => {
      const mockUser = { _id: 'user1', name: 'Updated' };
      authService.updateProfile.mockResolvedValue(mockUser);
      const context = { user: { _id: 'user1', role: 'user' } };

      const result = await userResolver.Mutation.updateProfile(
        {},
        { input: { name: 'Updated' } },
        context
      );

      expect(result).toEqual(mockUser);
    });

    it('should throw error when not logged in', async () => {
      const context = { user: null };

      await expect(
        userResolver.Mutation.updateProfile({}, { input: {} }, context)
      ).rejects.toThrow('Bạn chưa đăng nhập!');
    });
  });

  describe('Mutation.updateUserByAdmin', () => {
    it('should update user when admin', async () => {
      const mockUser = { _id: 'user1', name: 'Admin Updated' };
      authService.updateUserByAdmin.mockResolvedValue(mockUser);
      const context = { user: { role: 'admin' } };

      const result = await userResolver.Mutation.updateUserByAdmin(
        {},
        { id: '665a1b2c3d4e5f6a7b8c9d0e', input: { name: 'Admin Updated' } },
        context
      );

      expect(result).toEqual(mockUser);
    });

    it('should throw error when not admin', async () => {
      const context = { user: { role: 'user' } };

      await expect(
        userResolver.Mutation.updateUserByAdmin(
          {},
          { id: '665a1b2c3d4e5f6a7b8c9d0e', input: {} },
          context
        )
      ).rejects.toThrow('Bạn không có quyền thực hiện chức năng này!');
    });
  });
});
