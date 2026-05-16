const request = require('supertest');
const app = require('../../app');

jest.mock('../../models/User');
jest.mock('../../models/Cart');
jest.mock('../../utils/jwt');

const User = require('../../models/User');
const Cart = require('../../models/Cart');
const jwt = require('../../utils/jwt');

describe('Auth Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      User.findOne.mockResolvedValue(null);
      const mockUser = {
        _id: '665a1b2c3d4e5f6a7b8c9d0e',
        name: 'Test User',
        email: 'test@example.com',
        role: 'user',
      };
      User.create.mockResolvedValue(mockUser);
      Cart.create.mockResolvedValue({ _id: 'cart1', user: mockUser._id, items: [] });
      jwt.generateToken.mockReturnValue('fake-token');

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBe('fake-token');
    });

    it('should return 409 if email already exists', async () => {
      User.findOne.mockResolvedValue({ email: 'exists@example.com' });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'exists@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
    });

    it('should return 400 if required fields missing', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully with correct credentials', async () => {
      const mockUser = {
        _id: '665a1b2c3d4e5f6a7b8c9d0e',
        email: 'user@test.com',
        name: 'User',
        role: 'user',
        matchPassword: jest.fn().mockResolvedValue(true),
      };
      User.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue(mockUser) });
      jwt.generateToken.mockReturnValue('fake-token');

      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'user@test.com', password: 'password123' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBe('fake-token');
    });

    it('should return 400 with invalid input', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'wrong@test.com', password: 'wrong' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/profile', () => {
    it('should return 401 without token', async () => {
      const response = await request(app).get('/api/auth/profile');

      expect(response.status).toBe(401);
    });
  });
});
