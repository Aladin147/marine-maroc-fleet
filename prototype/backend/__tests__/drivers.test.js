const request = require('supertest');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

describe('Drivers API Tests', () => {
  let token;
  let testDriverId;

  beforeAll(async () => {
    await prisma.$connect();
    
    // Get auth token
    const response = await request('http://localhost:8000')
      .post('/api/auth/login')
      .send({
        email: 'admin@marinemaroc.com',
        password: 'password123'
      });
    token = response.body.token;
  });

  afterAll(async () => {
    // Clean up test driver if created
    if (testDriverId) {
      await prisma.driver.delete({ where: { id: testDriverId } }).catch(() => {});
    }
    await prisma.$disconnect();
  });

  describe('GET /api/drivers', () => {
    test('should return list of drivers', async () => {
      const response = await request('http://localhost:8000')
        .get('/api/drivers')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    test('should require authentication', async () => {
      const response = await request('http://localhost:8000')
        .get('/api/drivers');

      expect(response.status).toBe(401);
    });

    test('should include vehicle data', async () => {
      const response = await request('http://localhost:8000')
        .get('/api/drivers')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body[0]).toHaveProperty('vehicles');
    });
  });

  describe('POST /api/drivers', () => {
    test('should create new driver', async () => {
      const response = await request('http://localhost:8000')
        .post('/api/drivers')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test Driver',
          phone: '+212600999999',
          email: 'test@driver.com',
          password: 'testpass123'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('Test Driver');
      expect(response.body).not.toHaveProperty('password'); // Should be excluded
      
      testDriverId = response.body.id;
    });

    test('should reject duplicate phone', async () => {
      const response = await request('http://localhost:8000')
        .post('/api/drivers')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Another Driver',
          phone: '+212600000001' // Existing phone
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('should reject missing required fields', async () => {
      const response = await request('http://localhost:8000')
        .post('/api/drivers')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test Driver'
          // Missing phone
        });

      expect(response.status).toBe(400);
    });
  });

  describe('Multi-Tenancy', () => {
    test('should only return drivers from user company', async () => {
      const response = await request('http://localhost:8000')
        .get('/api/drivers')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      
      // All drivers should belong to company 1 (Marine Maroc)
      response.body.forEach(driver => {
        expect(driver.companyId).toBe(1);
      });
    });
  });
});
