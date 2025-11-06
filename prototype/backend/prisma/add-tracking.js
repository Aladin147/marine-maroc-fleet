const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addTracking() {
  console.log('🌱 Adding GPS tracking data...');

  // Get existing drivers with vehicles
  const drivers = await prisma.driver.findMany({
    take: 3,
    orderBy: { id: 'asc' },
    include: {
      vehicles: true
    }
  });

  if (drivers.length === 0) {
    console.log('❌ No drivers found. Run seed first.');
    return;
  }

  // Delete existing tracking points
  await prisma.trackingPoint.deleteMany({});
  console.log('🗑️  Cleared old tracking data');

  // Morocco coordinates: Realistic routes
  const trackingData = [
    // Driver 1: On route from Casablanca to Tangier
    {
      driverId: drivers[0].id,
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
    // Driver 2: In Casablanca area
    {
      driverId: drivers[1].id,
      points: [
        { lat: 33.5731, lng: -7.5898, time: -60 },  // Casablanca port
        { lat: 33.5892, lng: -7.6031, time: -45 },  // Moving in city
        { lat: 33.5950, lng: -7.6190, time: -30 },  // City center
        { lat: 33.5731, lng: -7.5898, time: -15 },  // Back to port
        { lat: 33.5731, lng: -7.5898, time: -5 }    // At port (current)
      ]
    },
    // Driver 3: On route from Marrakech to Casablanca
    {
      driverId: drivers.length > 2 ? drivers[2].id : drivers[0].id,
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

  let totalPoints = 0;
  for (const driver of trackingData) {
    for (const point of driver.points) {
      const recordedAt = new Date(Date.now() + point.time * 60 * 1000);
      await prisma.trackingPoint.create({
        data: {
          driverId: driver.driverId,
          latitude: point.lat,
          longitude: point.lng,
          speed: Math.random() * 40 + 60, // 60-100 km/h
          heading: Math.random() * 360,
          recordedAt: recordedAt
        }
      });
      totalPoints++;
    }
  }

  console.log(`✅ Created ${totalPoints} GPS tracking points for ${trackingData.length} drivers`);
  console.log('\n📍 Tracking routes:');
  console.log(`   Driver 1: Casablanca → Tangier (currently near Tangier)`);
  console.log(`   Driver 2: Casablanca area (currently at port)`);
  console.log(`   Driver 3: Marrakech → Casablanca (arrived 30 min ago)`);
}

addTracking()
  .catch((e) => {
    console.error('❌ Failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
