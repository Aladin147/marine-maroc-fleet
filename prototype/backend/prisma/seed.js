const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create companies
  const company1 = await prisma.company.upsert({
    where: { subdomain: 'marinemaroc' },
    update: {},
    create: {
      name: 'Marine Maroc',
      subdomain: 'marinemaroc',
      status: 'active',
      settings: {
        branding: {
          primaryColor: '#0047AB',
          accentColor: '#00CED1'
        },
        features: {
          voiceMessages: true,
          geofencing: false
        },
        localization: {
          defaultLanguage: 'ar',
          supportedLanguages: ['ar', 'fr']
        }
      }
    }
  });

  const company2 = await prisma.company.upsert({
    where: { subdomain: 'testcompany' },
    update: {},
    create: {
      name: 'Test Company',
      subdomain: 'testcompany',
      status: 'active'
    }
  });

  console.log('✅ Companies created');

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const user1 = await prisma.user.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Admin Marine Maroc',
      email: 'admin@marinemaroc.com',
      password: hashedPassword,
      role: 'admin',
      companyId: company1.id
    }
  });

  const user2 = await prisma.user.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Dispatcher Test',
      email: 'dispatcher@testcompany.com',
      password: hashedPassword,
      role: 'dispatcher',
      companyId: company2.id
    }
  });

  console.log('✅ Users created');

  // Create drivers for Marine Maroc
  const drivers = await Promise.all([
    prisma.driver.upsert({
      where: { id: 1 },
      update: {},
      create: {
        name: 'محمد أحمد (Mohamed Ahmed)',
        phone: '+212600000001',
        email: 'mohamed@marinemaroc.com',
        password: hashedPassword,
        status: 'available',
        companyId: company1.id
      }
    }),
    prisma.driver.upsert({
      where: { id: 2 },
      update: {},
      create: {
        name: 'يوسف حسن (Youssef Hassan)',
        phone: '+212600000002',
        email: 'youssef@marinemaroc.com',
        password: hashedPassword,
        status: 'available',
        companyId: company1.id
      }
    }),
    prisma.driver.upsert({
      where: { id: 3 },
      update: {},
      create: {
        name: 'عمر علي (Omar Ali)',
        phone: '+212600000003',
        status: 'offline',
        companyId: company1.id
      }
    })
  ]);

  console.log('✅ Drivers created');

  // Create vehicles
  const vehicles = await Promise.all([
    prisma.vehicle.upsert({
      where: { id: 1 },
      update: {},
      create: {
        plateNumber: 'A-12345',
        make: 'Mercedes',
        model: 'Actros',
        year: 2020,
        driverId: drivers[0].id,
        companyId: company1.id
      }
    }),
    prisma.vehicle.upsert({
      where: { id: 2 },
      update: {},
      create: {
        plateNumber: 'B-67890',
        make: 'Volvo',
        model: 'FH16',
        year: 2021,
        driverId: drivers[1].id,
        companyId: company1.id
      }
    }),
    prisma.vehicle.upsert({
      where: { id: 3 },
      update: {},
      create: {
        plateNumber: 'C-11111',
        make: 'Scania',
        model: 'R500',
        year: 2019,
        companyId: company1.id
      }
    })
  ]);

  console.log('✅ Vehicles created');

  // Create locations
  const locations = await Promise.all([
    prisma.location.upsert({
      where: { id: 1 },
      update: {},
      create: {
        name: 'Casablanca Warehouse',
        address: 'Zone Industrielle, Casablanca',
        latitude: 33.5731,
        longitude: -7.5898,
        type: 'warehouse',
        companyId: company1.id
      }
    }),
    prisma.location.upsert({
      where: { id: 2 },
      update: {},
      create: {
        name: 'Tangier Port',
        address: 'Port de Tanger Med, Tangier',
        latitude: 35.7595,
        longitude: -5.8340,
        type: 'port',
        companyId: company1.id
      }
    }),
    prisma.location.upsert({
      where: { id: 3 },
      update: {},
      create: {
        name: 'Marrakech Distribution Center',
        address: 'Route de Safi, Marrakech',
        latitude: 31.6295,
        longitude: -7.9811,
        type: 'distribution_center',
        companyId: company1.id
      }
    })
  ]);

  console.log('✅ Locations created');

  // Create sample orders
  const orders = await Promise.all([
    prisma.order.upsert({
      where: { id: 1 },
      update: {},
      create: {
        orderNumber: 'MM-2025-001',
        status: 'assigned',
        pickupLocationId: locations[0].id,
        deliveryLocationId: locations[1].id,
        driverId: drivers[0].id,
        vehicleId: vehicles[0].id,
        scheduledAt: new Date(),
        companyId: company1.id,
        metadata: {
          cargo: 'Heavy Equipment',
          weight: '15 tons',
          customer: 'ABC Construction'
        }
      }
    }),
    prisma.order.upsert({
      where: { id: 2 },
      update: {},
      create: {
        orderNumber: 'MM-2025-002',
        status: 'new',
        pickupLocationId: locations[0].id,
        deliveryLocationId: locations[2].id,
        scheduledAt: new Date(Date.now() + 86400000), // Tomorrow
        companyId: company1.id,
        metadata: {
          cargo: 'Construction Materials',
          weight: '10 tons'
        }
      }
    })
  ]);

  console.log('✅ Orders created');

  // Create realistic GPS tracking data for vehicles
  // Morocco coordinates: Casablanca to Tangier route
  const trackingData = [
    // Vehicle 1: On route from Casablanca to Tangier
    {
      vehicleId: vehicles[0].id,
      points: [
        { lat: 33.5731, lng: -7.5898, time: -120 }, // Casablanca (2 hours ago)
        { lat: 33.6891, lng: -7.3845, time: -105 }, // Moving north
        { lat: 33.8869, lng: -6.9030, time: -90 },  // Rabat area
        { lat: 34.0209, lng: -6.8416, time: -75 },  // North of Rabat
        { lat: 34.2611, lng: -6.5802, time: -60 },  // Kenitra area
        { lat: 34.6867, lng: -6.1499, time: -45 },  // Approaching Larache
        { lat: 35.1739, lng: -6.1463, time: -30 },  // Near Larache
        { lat: 35.5889, lng: -5.8037, time: -15 },  // Approaching Tangier
        { lat: 35.7595, lng: -5.8340, time: -5 }    // Tangier (5 min ago)
      ]
    },
    // Vehicle 2: In Casablanca area
    {
      vehicleId: vehicles[1].id,
      points: [
        { lat: 33.5731, lng: -7.5898, time: -60 },  // Casablanca port
        { lat: 33.5892, lng: -7.6031, time: -45 },  // Moving in city
        { lat: 33.5950, lng: -7.6190, time: -30 },  // City center
        { lat: 33.5731, lng: -7.5898, time: -15 },  // Back to port
        { lat: 33.5731, lng: -7.5898, time: -5 }    // At port (current)
      ]
    },
    // Vehicle 3: On route from Marrakech to Casablanca
    {
      vehicleId: vehicles[2].id,
      points: [
        { lat: 31.6295, lng: -7.9811, time: -180 }, // Marrakech (3 hours ago)
        { lat: 31.9167, lng: -7.9167, time: -150 }, // North of Marrakech
        { lat: 32.2934, lng: -8.1574, time: -120 }, // Safi area
        { lat: 32.6500, lng: -8.0833, time: -90 },  // El Jadida area
        { lat: 33.2316, lng: -8.5007, time: -60 },  // Approaching Casablanca
        { lat: 33.5731, lng: -7.5898, time: -30 }   // Casablanca (30 min ago)
      ]
    }
  ];

  for (const vehicle of trackingData) {
    for (const point of vehicle.points) {
      const timestamp = new Date(Date.now() + point.time * 60 * 1000);
      await prisma.trackingPoint.create({
        data: {
          vehicleId: vehicle.vehicleId,
          latitude: point.lat,
          longitude: point.lng,
          speed: Math.random() * 40 + 60, // 60-100 km/h
          heading: Math.random() * 360,
          timestamp: timestamp
        }
      });
    }
  }

  console.log('✅ GPS tracking data created');

  console.log('\n🎉 Seed completed successfully!\n');
  console.log('📝 Test Credentials:');
  console.log('   Email: admin@marinemaroc.com');
  console.log('   Password: password123');
  console.log('\n   Driver Phone: +212600000001');
  console.log('   Driver Password: password123\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
