import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Almaty center coordinates
const ALMATY_CENTER = {
  lat: 43.238949,
  lng: 76.889709,
};

// High-quality Unsplash image URLs organized by category
const mountainImages = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1464822759844-d150ad6bfc43?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1511497584788-876760111969?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1464822759844-d150ad6bfc43?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1511497584788-876760111969?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1464822759844-d150ad6bfc43?w=800&h=600&fit=crop',
];

const cityImages = [
  'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&h=600&fit=crop',
];

const parkImages = [
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop',
];

const serviceImages = [
  'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=800&h=600&fit=crop',
];

const buildingImages = [
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
];

function getImageForType(type: string): string {
  if (type === 'TOURIST_SPOT') {
    return mountainImages[Math.floor(Math.random() * mountainImages.length)];
  } else if (type === 'POLICE_STATION' || type === 'HOSPITAL' || type === 'FIRE_STATION') {
    return serviceImages[Math.floor(Math.random() * serviceImages.length)];
  } else if (type === 'SAFE_ZONE') {
    return parkImages[Math.floor(Math.random() * parkImages.length)];
  } else {
    return buildingImages[Math.floor(Math.random() * buildingImages.length)];
  }
}

// Generate random coordinates within Almaty radius (±0.05 degrees)
function generateRandomCoordinates(): { latitude: number; longitude: number } {
  const latOffset = (Math.random() - 0.5) * 0.1; // ±0.05
  const lngOffset = (Math.random() - 0.5) * 0.1; // ±0.05
  return {
    latitude: ALMATY_CENTER.lat + latOffset,
    longitude: ALMATY_CENTER.lng + lngOffset,
  };
}

// Generate tourist spots
function generateTouristSpots(count: number) {
  const spots = [
    'Park', 'Museum', 'Viewpoint', 'Monument', 'Square', 'Garden',
    'Cultural Center', 'Theater', 'Gallery', 'Market', 'Bazaar',
    'Mountain Trail', 'Observation Deck', 'Historical Site', 'Memorial',
  ];

  const locations = [];
  for (let i = 1; i <= count; i++) {
    const spotType = spots[Math.floor(Math.random() * spots.length)];
    const coords = generateRandomCoordinates();
    const num = i <= 3 ? ['Central', 'Main', 'Grand'][i - 1] : `#${i}`;
    
    locations.push({
      name: `${num} ${spotType}${i > 3 ? '' : ' of Almaty'}`,
      nameKz: `${num} ${spotType}`,
      nameRu: `${num} ${spotType}`,
      description: `Popular ${spotType.toLowerCase()} in Almaty, offering visitors a unique experience and beautiful views.`,
      descriptionKz: `Алматыдағы танымал ${spotType.toLowerCase()}, қонақтарға ерекше тәжірибе және әдемі көріністер ұсынады.`,
      descriptionRu: `Популярный ${spotType.toLowerCase()} в Алматы, предлагающий посетителям уникальный опыт и красивые виды.`,
      ...coords,
      type: 'TOURIST_SPOT',
      safetyRating: ['VERY_SAFE', 'SAFE', 'SAFE'][Math.floor(Math.random() * 3)],
      entryCost: Math.random() > 0.3 ? Math.floor(Math.random() * 5000) + 500 : null,
      isFree: Math.random() > 0.7,
      address: `District ${i}, Almaty`,
      addressKz: `${i} аудан, Алматы`,
      addressRu: `Район ${i}, Алматы`,
      phoneNumber: `+7 727 234 ${String(5000 + i).padStart(4, '0')}`,
      website: i <= 5 ? `https://almaty-${spotType.toLowerCase()}-${i}.kz` : null,
      tags: ['tourist', spotType.toLowerCase(), 'almaty'],
      is24Hours: false,
      verified: i <= 10,
      imageUrl: '/images/tourist-spot.jpg',
    });
  }
  return locations;
}

// Generate police stations
function generatePoliceStations(count: number) {
  const districts = [
    'Medeu', 'Almaly', 'Zhetysu', 'Turksib', 'Auezov', 'Bostandyk',
    'Nauryzbay', 'Alatau', 'Ile', 'Jetisu', 'Karasay', 'Raiymbek',
    'Seyfullin', 'Turan', 'Uly Dala',
  ];

  const locations = [];
  for (let i = 1; i <= count; i++) {
    const district = districts[i - 1] || `District ${i}`;
    const coords = generateRandomCoordinates();
    
    locations.push({
      name: `${district} District Police Department${i === 1 ? '' : ` #${i}`}`,
      nameKz: `${district} ауданы полиция басқармасы`,
      nameRu: `Управление полиции ${district}ского района`,
      description: `Police department serving ${district} district of Almaty. Available 24/7 for emergencies.`,
      descriptionKz: `${district} ауданына қызмет көрсететін полиция басқармасы. Төтенше жағдайлар үшін 24/7 қолжетімді.`,
      descriptionRu: `Управление полиции, обслуживающее ${district}ский район Алматы. Доступно 24/7 для экстренных случаев.`,
      ...coords,
      type: 'POLICE_STATION',
      safetyRating: 'VERY_SAFE',
      isFree: true,
      address: `${district} District, Almaty`,
      addressKz: `${district} ауданы, Алматы`,
      addressRu: `${district}ский район, Алматы`,
      phoneNumber: i === 1 ? '+7 727 102' : `+7 727 234 ${String(2000 + i).padStart(4, '0')}`,
      is24Hours: true,
      tags: ['police', 'emergency', 'security', district.toLowerCase()],
      verified: true,
      imageUrl: '/images/police.jpg',
    });
  }
  return locations;
}

// Generate hospitals
function generateHospitals(count: number) {
  const types = [
    'City Hospital', 'Regional Hospital', 'Medical Center', 'Clinic',
    'Emergency Hospital', 'Children\'s Hospital', 'Maternity Hospital',
    'Trauma Center', 'General Hospital', 'Specialized Hospital',
  ];

  const locations = [];
  for (let i = 1; i <= count; i++) {
    const hospitalType = types[Math.min(i - 1, types.length - 1)];
    const coords = generateRandomCoordinates();
    
    locations.push({
      name: `${hospitalType}${i > 1 ? ` #${i}` : ''}`,
      nameKz: `${hospitalType}${i > 1 ? ` №${i}` : ''}`,
      nameRu: `${hospitalType}${i > 1 ? ` №${i}` : ''}`,
      description: `Medical facility providing emergency and general healthcare services in Almaty.`,
      descriptionKz: `Алматыда төтенше және жалпы денсаулық сақтау қызметтерін ұсынатын медициналық мекеме.`,
      descriptionRu: `Медицинское учреждение, предоставляющее экстренную и общую медицинскую помощь в Алматы.`,
      ...coords,
      type: 'HOSPITAL',
      safetyRating: 'VERY_SAFE',
      isFree: true,
      address: `Medical District ${i}, Almaty`,
      addressKz: `Медициналық аудан ${i}, Алматы`,
      addressRu: `Медицинский район ${i}, Алматы`,
      phoneNumber: `+7 727 234 ${String(1000 + i).padStart(4, '0')}`,
      is24Hours: i <= 7,
      tags: ['hospital', 'medical', 'emergency', 'healthcare'],
      verified: true,
      imageUrl: '/images/hospital.jpg',
    });
  }
  return locations;
}

// Generate safe zones
function generateSafeZones(count: number) {
  const zoneTypes = [
    'Central', 'Shopping', 'Residential', 'Business', 'Tourist',
    'Park', 'Recreation', 'Cultural', 'Educational', 'Transport',
  ];

  const locations = [];
  for (let i = 1; i <= count; i++) {
    const zoneType = zoneTypes[Math.min(i - 1, zoneTypes.length - 1)];
    const coords = generateRandomCoordinates();
    
    locations.push({
      name: `${zoneType} Safe Zone ${i > 1 ? `#${i}` : ''}`,
      nameKz: `${zoneType} қауіпсіз аймақ ${i > 1 ? `№${i}` : ''}`,
      nameRu: `${zoneType} безопасная зона ${i > 1 ? `№${i}` : ''}`,
      description: `Designated safe zone in Almaty with enhanced security and monitoring.`,
      descriptionKz: `Қосымша қауіпсіздік және мониторингі бар Алматыдағы белгіленген қауіпсіз аймақ.`,
      descriptionRu: `Обозначенная безопасная зона в Алматы с усиленной безопасностью и мониторингом.`,
      ...coords,
      type: 'SAFE_ZONE',
      safetyRating: ['VERY_SAFE', 'VERY_SAFE', 'SAFE'][Math.floor(Math.random() * 3)],
      isFree: true,
      address: `${zoneType} Area, Almaty`,
      addressKz: `${zoneType} аумағы, Алматы`,
      addressRu: `${zoneType} район, Алматы`,
      phoneNumber: null,
      is24Hours: true,
      tags: ['safe-zone', zoneType.toLowerCase(), 'security'],
      verified: i <= 5,
      imageUrl: getImageForType('SAFE_ZONE'),
    });
  }
  return locations;
}

// Generate evacuation points (schools, gyms, community centers)
function generateEvacuationPoints(count: number) {
  const facilityTypes = [
    'School', 'Gymnasium', 'Community Center', 'Sports Complex',
    'Cultural Center', 'Library', 'University', 'Stadium',
  ];
  
  const districts = [
    'Medeu', 'Almaly', 'Zhetysu', 'Turksib', 'Auezov', 'Bostandyk',
    'Nauryzbay', 'Alatau', 'Ile', 'Jetisu',
  ];

  const locations = [];
  for (let i = 1; i <= count; i++) {
    const facilityType = facilityTypes[Math.floor(Math.random() * facilityTypes.length)];
    const district = districts[Math.min(i - 1, districts.length - 1)];
    const coords = generateRandomCoordinates();
    
    locations.push({
      name: `${district} ${facilityType}${i > 1 ? ` #${i}` : ''} - Evacuation Point`,
      nameKz: `${district} ${facilityType} - Эвакуация нүктесі`,
      nameRu: `${district} ${facilityType} - Пункт эвакуации`,
      description: `Designated earthquake evacuation point. Open 24/7 during emergencies. Capacity: ${Math.floor(Math.random() * 500) + 200} people.`,
      descriptionKz: `Жер сілкіну кезіндегі белгіленген эвакуация нүктесі. Төтенше жағдайларда 24/7 ашық. Сыйымдылығы: ${Math.floor(Math.random() * 500) + 200} адам.`,
      descriptionRu: `Обозначенный пункт эвакуации при землетрясении. Открыт 24/7 в чрезвычайных ситуациях. Вместимость: ${Math.floor(Math.random() * 500) + 200} человек.`,
      ...coords,
      type: 'EVACUATION_POINT',
      safetyRating: 'VERY_SAFE',
      isFree: true,
      address: `${district} District, Almaty`,
      addressKz: `${district} ауданы, Алматы`,
      addressRu: `${district}ский район, Алматы`,
      phoneNumber: `+7 727 112`,
      is24Hours: true,
      tags: ['evacuation', 'earthquake', 'emergency', district.toLowerCase(), facilityType.toLowerCase()],
      verified: true,
      imageUrl: getImageForType('SAFE_ZONE'), // Use safe zone images for evacuation points
    });
  }
  return locations;
}

// Generate mountain shelters and rescue points
function generateMountainShelters() {
  const shelters = [
    {
      name: 'Medeu Rescue Base',
      nameKz: 'Медеу құтқару базасы',
      nameRu: 'Спасательная база Медеу',
      description: 'Main rescue base for mountain emergencies. 24/7 rescue services available.',
      descriptionKz: 'Тау төтенше жағдайлары үшін негізгі құтқару базасы. 24/7 құтқару қызметтері қолжетімді.',
      descriptionRu: 'Главная спасательная база для горных чрезвычайных ситуаций. Службы спасения доступны 24/7.',
      latitude: 43.15,
      longitude: 76.95,
      type: 'RESCUE_POINT',
      phoneNumber: '+7 727 112',
      imageUrl: '/images/medeo.jpg',
    },
    {
      name: 'Gorelnik Shelter',
      nameKz: 'Горельник баспанасы',
      nameRu: 'Убежище Горельник',
      description: 'Mountain shelter for hikers. Provides basic accommodation and emergency supplies.',
      descriptionKz: 'Тауға шығатындарға арналған тау баспанасы. Негізгі тұрғын үй және төтенше жағдайлар үшін материалдар ұсынады.',
      descriptionRu: 'Горное убежище для туристов. Предоставляет базовое жилье и аварийные запасы.',
      latitude: 43.12,
      longitude: 76.98,
      type: 'MOUNTAIN_SHELTER',
      phoneNumber: null,
      imageUrl: '/images/gorelnik.jpg',
    },
    {
      name: 'Shymbulak Station',
      nameKz: 'Шымбұлақ станциясы',
      nameRu: 'Станция Шымбулак',
      description: 'Ski resort station with rescue facilities. Emergency services available during ski season.',
      descriptionKz: 'Құтқару құралдары бар шаңғы курорты станциясы. Шаңғы маусымында төтенше қызметтер қолжетімді.',
      descriptionRu: 'Станция горнолыжного курорта со спасательными средствами. Экстренные службы доступны в лыжный сезон.',
      latitude: 43.10,
      longitude: 76.97,
      type: 'RESCUE_POINT',
      phoneNumber: '+7 727 234 5678',
      imageUrl: '/images/shymbulak.jpg',
    },
    {
      name: 'Kok-Tobe Safety Post',
      nameKz: 'Көк-Төбе қауіпсіздік посты',
      nameRu: 'Пост безопасности Кок-Тобе',
      description: 'Safety monitoring post on Kok-Tobe mountain. First aid and emergency communication available.',
      descriptionKz: 'Көк-Төбе тауындағы қауіпсіздікті бақылау посты. Алғашқы медициналық көмек және төтенше байланыс қолжетімді.',
      descriptionRu: 'Пост мониторинга безопасности на горе Кок-Тобе. Доступна первая помощь и экстренная связь.',
      latitude: 43.25,
      longitude: 76.95,
      type: 'RESCUE_POINT',
      phoneNumber: '+7 727 234 5679',
      imageUrl: '/images/koktobe.jpg',
    },
  ];

  return shelters.map((shelter, i) => ({
    ...shelter,
    latitude: shelter.latitude,
    longitude: shelter.longitude,
    safetyRating: 'VERY_SAFE',
    isFree: true,
    address: `Mountain Area ${i + 1}, Almaty`,
    addressKz: `Таулы аумақ ${i + 1}, Алматы`,
    addressRu: `Горная зона ${i + 1}, Алматы`,
    is24Hours: shelter.type === 'RESCUE_POINT',
    tags: ['mountain', 'shelter', 'rescue', shelter.type.toLowerCase()],
    verified: true,
    imageUrl: getImageForType('TOURIST_SPOT'),
  }));
}

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing locations to prevent duplicates
  await prisma.location.deleteMany({});
  console.log('🧹 Cleared existing locations to prevent duplicates...');

  // Generate locations programmatically
  const touristSpots = generateTouristSpots(15);
  const policeStations = generatePoliceStations(15);
  const hospitals = generateHospitals(10);
  const safeZones = generateSafeZones(10);
  const evacuationPoints = generateEvacuationPoints(10);
  const mountainShelters = generateMountainShelters();

  const allLocations = [
    ...touristSpots,
    ...policeStations,
    ...hospitals,
    ...safeZones,
    ...evacuationPoints,
    ...mountainShelters,
  ];

  console.log(`📍 Seeding ${allLocations.length} locations...`);
  console.log(`   - ${touristSpots.length} Tourist Spots`);
  console.log(`   - ${policeStations.length} Police Stations`);
  console.log(`   - ${hospitals.length} Hospitals`);
  console.log(`   - ${safeZones.length} Safe Zones`);
  console.log(`   - ${evacuationPoints.length} Evacuation Points`);
  console.log(`   - ${mountainShelters.length} Mountain Shelters & Rescue Points`);

  for (const location of allLocations) {
    const loc = location as any; // Cast to any to avoid TypeScript errors
    const id = `loc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const tagsArray = loc.tags.map((t: string) => `'${t.replace(/'/g, "''")}'`).join(',');
    
    await prisma.$executeRawUnsafe(`
      INSERT INTO locations (
        id, name, name_kz, name_ru, description, description_kz, description_ru,
        coordinates, type, safety_rating, entry_cost, is_free,
        address, address_kz, address_ru, phone_number, website, email,
        opening_hours, is_24_hours, image_url, tags, verified, created_by_id,
        created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        ST_SetSRID(ST_MakePoint($8, $9), 4326),
        $10::"LocationType", $11::"SafetyRating", $12, $13,
        $14, $15, $16, $17, $18, $19,
        $20, $21, $22, ARRAY[${tagsArray}]::text[], $23, $24,
        NOW(), NOW()
      )
    `,
      id,
      loc.name,
      loc.nameKz,
      loc.nameRu,
      loc.description,
      loc.descriptionKz,
      loc.descriptionRu,
      loc.longitude,
      loc.latitude,
      loc.type,
      loc.safetyRating,
      loc.entryCost || null,
      loc.isFree,
      loc.address,
      loc.addressKz,
      loc.addressRu,
      loc.phoneNumber || null,
      loc.website || null,
      null, // email
      null, // opening_hours
      loc.is24Hours,
      loc.imageUrl || null, // image_url
      loc.verified,
      null // created_by_id
    );
  }

  console.log('✅ Database seeded successfully!');
  console.log(`📍 Created ${allLocations.length} locations in Almaty`);

  // Seed Safety Tips
  console.log('💡 Seeding safety tips...');
  
  // Clear existing tips to prevent duplicates
  await prisma.safetyTip.deleteMany({});
  console.log('🧹 Cleared existing safety tips...');
  
  // Hardcoded TIPS array with verified Unsplash URLs
  const TIPS = [
    {
      title: 'Earthquake Safety',
      titleKz: 'Жер сілкіну қауіпсіздігі',
      titleRu: 'Безопасность при землетрясении',
      content: 'Drop, Cover, and Hold on. Stay away from windows.',
      contentKz: 'Жығылыңыз, жасырыныңыз және ұстаңыз. Терезелерден аулақ болыңыз.',
      contentRu: 'Падайте, укрывайтесь и держитесь. Держитесь подальше от окон.',
      category: 'EMERGENCY_PREPAREDNESS' as const,
      priority: 10,
      imageUrl: '/images/earthquake-safety.jpg',
    },
    {
      title: 'Winter Precautions',
      titleKz: 'Қысқы сақтық шаралары',
      titleRu: 'Зимние меры предосторожности',
      content: 'Wear layers. Watch out for icy sidewalks.',
      contentKz: 'Қабаттап киініңіз. Мұздалған тротуарларға сақ болыңыз.',
      contentRu: 'Одевайтесь слоями. Будьте осторожны на обледенелых тротуарах.',
      category: 'WEATHER_SAFETY' as const,
      priority: 8,
      imageUrl: '/images/winter.jpg',
    },
    {
      title: 'Night Safety',
      titleKz: 'Түндегі қауіпсіздік',
      titleRu: 'Безопасность ночью',
      content: 'Stick to lit streets and use official taxi apps.',
      contentKz: 'Жарықталған көшелерде қалыңыз және ресми такси қосымшаларын пайдаланыңыз.',
      contentRu: 'Оставайтесь на освещенных улицах и используйте официальные приложения такси.',
      category: 'CITY_SAFETY' as const,
      priority: 8,
      imageUrl: '/images/night.jpg',
    },
    {
      title: 'Emergency Bag',
      titleKz: 'Төтенше жинақ',
      titleRu: 'Экстренный набор',
      content: 'Keep a kit with documents and water ready.',
      contentKz: 'Құжаттар мен су бар жинақты дайындап ұстаңыз.',
      contentRu: 'Держите готовый набор с документами и водой.',
      category: 'GENERAL' as const,
      priority: 9,
      imageUrl: '/images/emergency.jpg',
    },
    {
      title: 'Cultural Etiquette',
      titleKz: 'Мәдени этикет',
      titleRu: 'Культурный этикет',
      content: 'Respect elders and local traditions.',
      contentKz: 'Ақсақалдарды және жергілікті дәстүрлерді құрметтеңіз.',
      contentRu: 'Уважайте старших и местные традиции.',
      category: 'CULTURAL_ETIQUETTE' as const,
      priority: 6,
      imageUrl: 'https://images.unsplash.com/photo-1558588942-930faae5a389?w=800&h=600&fit=crop',
    },
    {
      title: 'Mountain Rules',
      titleKz: 'Тау ережелері',
      titleRu: 'Правила для гор',
      content: 'Don\'t hike alone. Check weather forecasts.',
      contentKz: 'Жалғыз жүрмеңіз. Ауа райы болжамдарын тексеріңіз.',
      contentRu: 'Не ходите в одиночку. Проверяйте прогнозы погоды.',
      category: 'MOUNTAIN_SAFETY' as const,
      priority: 10,
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    },
    {
      title: 'Emergency Numbers',
      titleKz: 'Төтенше нөмірлер',
      titleRu: 'Экстренные номера',
      content: '102 - Police, 103 - Ambulance, 112 - SOS.',
      contentKz: '102 - Полиция, 103 - Жедел жәрдем, 112 - SOS.',
      contentRu: '102 - Полиция, 103 - Скорая помощь, 112 - SOS.',
      category: 'GENERAL' as const,
      priority: 10,
      imageUrl: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=800&h=600&fit=crop',
    },
    {
      title: 'First Aid',
      titleKz: 'Алғашқы көмек',
      titleRu: 'Первая помощь',
      content: 'Carry basic bandages and know nearest hospitals.',
      contentKz: 'Негізгі бинттерді алып жүріңіз және ең жақын ауруханаларды біліңіз.',
      contentRu: 'Носите базовые бинты и знайте ближайшие больницы.',
      category: 'GENERAL' as const,
      priority: 8,
      imageUrl: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&h=600&fit=crop',
    },
  ];

  for (const tip of TIPS) {
    const id = `tip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await prisma.$executeRawUnsafe(`
      INSERT INTO safety_tips (
        id, title, title_kz, title_ru, content, content_kz, content_ru,
        category, priority, image_url, is_active, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        $8::"SafetyTipCategory", $9, $10, true, NOW(), NOW()
      )
    `,
      id,
      tip.title,
      tip.titleKz,
      tip.titleRu,
      tip.content,
      tip.contentKz,
      tip.contentRu,
      tip.category,
      tip.priority,
      tip.imageUrl
    );
  }

  console.log(`💡 Created ${TIPS.length} safety tips`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
