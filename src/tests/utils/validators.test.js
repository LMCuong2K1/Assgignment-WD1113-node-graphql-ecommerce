const { objectIdSchema } = require('../../utils/validators');

describe('validators.objectIdSchema', () => {
  it('should pass for valid 24-char hex ObjectId', () => {
    const result = objectIdSchema.safeParse('665a1b2c3d4e5f6a7b8c9d0e');
    expect(result.success).toBe(true);
  });

  it('should fail for short string', () => {
    const result = objectIdSchema.safeParse('abc123');
    expect(result.success).toBe(false);
  });

  it('should fail for empty string', () => {
    const result = objectIdSchema.safeParse('');
    expect(result.success).toBe(false);
  });

  it('should fail for non-hex characters', () => {
    const result = objectIdSchema.safeParse('665a1b2c3d4e5f6a7b8c9d0g');
    expect(result.success).toBe(false);
  });

  it('should fail for undefined', () => {
    const result = objectIdSchema.safeParse(undefined);
    expect(result.success).toBe(false);
  });

  it('should fail for null', () => {
    const result = objectIdSchema.safeParse(null);
    expect(result.success).toBe(false);
  });

  it('should return correct error message for invalid input', () => {
    const result = objectIdSchema.safeParse('invalid');
    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toBe('ID không hợp lệ hoặc bỏ trống!');
  });
});
