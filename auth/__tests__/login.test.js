const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user.models');

describe('POST /api/auth/login', () => {
  const userPayload = {
    username: 'loginuser',
    email: 'login@example.com',
    password: 'Secret123',
    fullName: { firstName: 'Login', lastName: 'User' }
  };

  beforeAll(async () => {
    await User.deleteMany({});
    // register the user via the real endpoint to ensure password is hashed
    await request(app).post('/api/auth/register').send(userPayload);
  });

  afterAll(async () => {
    await User.deleteMany({});
  });

  test('should login with correct credentials and return token cookie', async () => {
    const res = await request(app).post('/api/auth/login').send({ username: userPayload.username, password: userPayload.password });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Login successful');
    // cookie should be set (supertest stores set-cookie header)
    expect(res.headers['set-cookie']).toBeDefined();
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('email', userPayload.email);
  });

  test('should return 401 for wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({ username: userPayload.username, password: 'wrong' });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message', 'Invalid credentials');
  });

  test('should return 401 for unknown user', async () => {
    const res = await request(app).post('/api/auth/login').send({ username: 'noone', password: 'somepass' });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message', 'Invalid credentials');
  });
});
