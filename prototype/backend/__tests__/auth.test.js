const request = require('supertest');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// We'll need to create a test app instance
// For now, let's create a simple test file structure

describe('Authentication Tests', () => {
  beforeAll(async () => {
    // Ensure test data exists
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/auth/login', () => {
    test('should login with valid credentials', async () => {
      const response = await request('http://localhost:8000')
        .post('/api/auth/login')
        .send({
          email: 'admin@marinemaroc.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe('admin@marinemaroc.com');
    });

    test('should reject invalid credentials', async () => {
      const response = await request('http://localhost:8000')
        .post('/api/auth/login')
        .send({
          email: 'admin@marinemaroc.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    test('should reject missing credentials', async () => {
      const response = await request('http://localhost:8000')
        .post('/api/auth/login')
        .send({});

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/auth/me', () => {
    let token;

    beforeAll(async () => {
      // Get token
      const response = await request('http://localhost:8000')
        .post('/api/auth/login')
        .send({
          email: 'admin@marinemaroc.com',
          password: 'password123'
        });
      token = response.body.token;
    });

    test('should return user with valid token', async () => {
      const response = await request('http://localhost:8000')
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe('admin@marinemaroc.com');
    });

    test('should reject request without token', async () => {
      const response = await request('http://localhost:8000')
        .get('/api/auth/me');

      expect(response.status).toBe(401);
    });

    test('should reject invalid token', async () => {
      const response = await request('http://localhost:8000')
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
    });
  });
});
