const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user.models');

describe('POST /api/auth/register', () => {
  const validPayload = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
    fullName: { firstName: 'Test', lastName: 'User' }
  };

  beforeEach(async () => {
    await User.deleteMany({});
  });

  test('should create a user and return 201', async () => {
    const res = await request(app).post('/api/auth/register').send(validPayload);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('_id');
    expect(res.body.user.email).toBe(validPayload.email);

    const user = await User.findOne({ email: validPayload.email }).lean();
    expect(user).not.toBeNull();
    expect(user.username).toBe(validPayload.username);
    // Current implementation stores password as provided; if you add hashing later,
    // update this assertion accordingly.
    expect(user.password).toBe(validPayload.password);
  });

  test('should return 400/409 for duplicate user', async () => {
    await request(app).post('/api/auth/register').send(validPayload);
    const res = await request(app).post('/auth/register').send(validPayload);

    expect(res.status).toBe(400);
    // The route returns { error: err.message } on failure
    expect(res.body).toHaveProperty('error');
  });
});
