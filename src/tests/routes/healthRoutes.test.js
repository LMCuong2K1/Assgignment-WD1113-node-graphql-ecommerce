const request = require('supertest');
const app = require('../../app');

describe('Health Route', () => {
  it('should return health status', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(503);
    expect(response.body.status).toBe('degraded');
    expect(response.body.database.status).toBe('disconnected');
  });
});
