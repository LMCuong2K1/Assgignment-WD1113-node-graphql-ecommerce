const { generateToken } = require('../../utils/jwt');

describe('jwt.generateToken', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    jest.resetModules();
    process.env.JWT_SECRET = 'test-secret-key';
    process.env.JWT_EXPIRES_IN = '1h';
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('should generate a valid JWT token', () => {
    const token = generateToken('665a1b2c3d4e5f6a7b8c9d0e');
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(token.split('.')).toHaveLength(3);
  });

  it('should include userId in token payload', () => {
    const jwt = require('jsonwebtoken');
    const token = generateToken('665a1b2c3d4e5f6a7b8c9d0e');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    expect(decoded.id).toBe('665a1b2c3d4e5f6a7b8c9d0e');
  });

  it('should use default expiration when JWT_EXPIRES_IN not set', () => {
    delete process.env.JWT_EXPIRES_IN;
    const { generateToken: genToken } = require('../../utils/jwt');
    const jwt = require('jsonwebtoken');
    const token = genToken('665a1b2c3d4e5f6a7b8c9d0e');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    expect(decoded.exp).toBeDefined();
  });

  it('should throw if JWT_SECRET is not set', () => {
    delete process.env.JWT_SECRET;
    const { generateToken: genToken } = require('../../utils/jwt');
    expect(() => genToken('665a1b2c3d4e5f6a7b8c9d0e')).toThrow();
  });
});
