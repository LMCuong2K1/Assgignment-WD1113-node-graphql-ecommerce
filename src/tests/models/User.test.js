const bcrypt = require('bcryptjs');
const User = require('../../models/User');

describe('User Model', () => {
  describe('matchPassword method exists', () => {
    it('should have matchPassword method defined', () => {
      const user = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });

      expect(typeof user.matchPassword).toBe('function');
    });
  });

  describe('pre-save hook structure', () => {
    it('should have pre-save hook registered', () => {
      const schema = User.schema;
      const s = schema.s;
      expect(s.hooks._pres.get('save')).toBeDefined();
    });
  });
});
