const logger = require('../../utils/logger');

describe('logger', () => {
  it('should be defined', () => {
    expect(logger).toBeDefined();
  });

  it('should have info, error, warn, debug methods', () => {
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.error).toBe('function');
    expect(typeof logger.warn).toBe('function');
    expect(typeof logger.debug).toBe('function');
  });

  it('should log info level without throwing', () => {
    expect(() => logger.info('Test info message')).not.toThrow();
  });

  it('should log error level without throwing', () => {
    expect(() => logger.error('Test error message')).not.toThrow();
  });

  it('should log error with stack trace', () => {
    const err = new Error('Test error with stack');
    expect(() => logger.error(err)).not.toThrow();
  });
});
