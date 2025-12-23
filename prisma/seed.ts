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
      imageUrl: getImageForType('TOURIST_SPOT'),
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
      imageUrl: getImageForType('POLICE_STATION'),
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
      imageUrl: getImageForType('HOSPITAL'),
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
    const id = `loc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const tagsArray = location.tags.map(t => `'${t.replace(/'/g, "''")}'`).join(',');
    
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
      location.name,
      location.nameKz,
      location.nameRu,
      location.description,
      location.descriptionKz,
      location.descriptionRu,
      location.longitude,
      location.latitude,
      location.type,
      location.safetyRating,
      (location as any).entryCost || null,
      location.isFree,
      location.address,
      location.addressKz,
      location.addressRu,
      location.phoneNumber || null,
      location.website || null,
      null, // email
      null, // opening_hours
      location.is24Hours,
      location.imageUrl || null, // image_url
      location.verified,
      null // created_by_id
    );
  }

  console.log('✅ Database seeded successfully!');
  console.log(`📍 Created ${allLocations.length} locations in Almaty`);

  // Seed Safety Tips (keeping existing tips)
  console.log('💡 Seeding safety tips...');
  
  const safetyTips = [
    {
      title: 'Mountain Hiking Safety Rules',
      titleKz: 'Тауға шығу қауіпсіздік ережелері',
      titleRu: 'Правила безопасности при походах в горы',
      content: 'Always inform someone about your hiking plans. Check weather conditions before heading out. Bring sufficient water, food, and warm clothing. Stay on marked trails and avoid going alone in remote areas.',
      contentKz: 'Әрқашан біреуге жоспарыңыз туралы хабарлаңыз. Шығар алдында ауа райын тексеріңіз. Жеткілікті су, тағам және жылы киім алыңыз. Белгіленген жолдарда қалыңыз және жалғыз жерлерде жалғыз жүрмеңіз.',
      contentRu: 'Всегда сообщайте кому-то о своих планах похода. Проверяйте погодные условия перед выходом. Берите достаточно воды, еды и теплой одежды. Оставайтесь на размеченных тропах и избегайте одиночных походов в отдаленные районы.',
      category: 'MOUNTAIN_SAFETY',
      priority: 10,
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    },
    {
      title: 'Taxi Safety in Almaty',
      titleKz: 'Алматыда такси қауіпсіздігі',
      titleRu: 'Безопасность такси в Алматы',
      content: 'Use official taxi apps (Yandex.Taxi, Uber). Always check the license plate matches the app. Share your ride details with someone. Avoid unmarked taxis, especially at night.',
      contentKz: 'Ресми такси қосымшаларын пайдаланыңыз (Yandex.Taxi, Uber). Нөмірі қосымшаға сәйкес келетінін әрқашан тексеріңіз. Саяхат мәліметтерін біреумен бөлісіңіз. Белгісіз таксилерден, әсіресе түнде сақтаныңыз.',
      contentRu: 'Используйте официальные приложения такси (Yandex.Taxi, Uber). Всегда проверяйте, что номерной знак соответствует приложению. Делитесь деталями поездки с кем-то. Избегайте неофициальных такси, особенно ночью.',
      category: 'CITY_SAFETY',
      priority: 9,
      imageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800',
    },
    {
      title: 'Winter Weather Precautions',
      titleKz: 'Қысқы ауа райы сақтық шаралары',
      titleRu: 'Меры предосторожности в зимнюю погоду',
      content: 'Almaty winters can be harsh. Dress in layers, wear proper footwear with good grip. Be cautious of icy sidewalks. Keep emergency contacts handy. Monitor weather forecasts regularly.',
      contentKz: 'Алматы қысы қатал болуы мүмкін. Қабаттап киініңіз, жақсы тұтастыруы бар дұрыс аяқ киім киіңіз. Мұздалған тротуарларға сақ болыңыз. Төтенше байланыстарды қолыңызда ұстаңыз. Ауа райы болжамдарын дұрыс бақылаңыз.',
      contentRu: 'Зимы в Алматы могут быть суровыми. Одевайтесь слоями, носите подходящую обувь с хорошим сцеплением. Будьте осторожны на обледенелых тротуарах. Держите контакты для экстренных случаев под рукой. Регулярно следите за прогнозами погоды.',
      category: 'WEATHER_SAFETY',
      priority: 8,
      imageUrl: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e8?w=800',
    },
    {
      title: 'Emergency Preparedness',
      titleKz: 'Төтенше дайындық',
      titleRu: 'Готовность к чрезвычайным ситуациям',
      content: 'Save emergency numbers: Police (102), Ambulance (103), Fire (101). Keep a copy of your passport and important documents. Know the location of your embassy. Have a basic first aid kit.',
      contentKz: 'Төтенше нөмірлерді сақтаңыз: Полиция (102), Жедел жәрдем (103), Өрт (101). Паспорт көшірмесін және маңызды құжаттарды ұстаңыз. Елшілігіңіздің орналасқан жерін біліңіз. Негізгі дәрігерлік жинақыңыз болсын.',
      contentRu: 'Сохраните экстренные номера: Полиция (102), Скорая помощь (103), Пожарная (101). Держите копию паспорта и важных документов. Знайте расположение вашего посольства. Имейте базовую аптечку первой помощи.',
      category: 'EMERGENCY_PREPAREDNESS',
      priority: 10,
      imageUrl: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=800',
    },
    {
      title: 'Public Transport Safety',
      titleKz: 'Жалпыға ортақ көлік қауіпсіздігі',
      titleRu: 'Безопасность общественного транспорта',
      content: 'Be aware of your surroundings on buses and metro. Keep valuables secure and out of sight. Avoid displaying expensive items. During peak hours, be extra cautious of pickpockets.',
      contentKz: 'Автобустарда және метрода айналаңызға назар аударыңыз. Құнды заттарды қауіпсіз жерде және көзден жасырыңыз. Қымбат заттарды көрсетпеңіз. Шақтың шамасында карман ұрлаушыларға ерекше сақ болыңыз.',
      contentRu: 'Будьте внимательны к своему окружению в автобусах и метро. Держите ценности в безопасности и вне поля зрения. Избегайте демонстрации дорогих предметов. В часы пик будьте особенно осторожны с карманными ворами.',
      category: 'TRANSPORT_SAFETY',
      priority: 7,
      imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800',
    },
    {
      title: 'Cultural Etiquette Tips',
      titleKz: 'Мәдени этикет кеңестері',
      titleRu: 'Советы по культурному этикету',
      content: 'Respect local customs and traditions. Learn basic Kazakh or Russian phrases. Remove shoes when entering homes. Be polite and patient. Dress modestly when visiting religious sites.',
      contentKz: 'Жергілікті салт-дәстүрлер мен дәстүрлерді құрметтеңіз. Негізгі қазақша немесе орысша сөйлемдерді үйреніңіз. Үйлерге кіргенде аяқ киімді шешіңіз. Мейірімді және сабырлы болыңыз. Діни орындарды бару кезінде кішіпейіл киініңіз.',
      contentRu: 'Уважайте местные обычаи и традиции. Изучите основные фразы на казахском или русском языке. Снимайте обувь при входе в дома. Будьте вежливы и терпеливы. Одевайтесь скромно при посещении религиозных мест.',
      category: 'CULTURAL_ETIQUETTE',
      priority: 6,
      imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800',
    },
    {
      title: 'Night Safety in Almaty',
      titleKz: 'Алматыда түндегі қауіпсіздік',
      titleRu: 'Безопасность ночью в Алматы',
      content: 'Stick to well-lit areas. Avoid walking alone late at night. Use trusted transportation. Keep your phone charged. Trust your instincts - if something feels wrong, leave the area.',
      contentKz: 'Жақсы жарықталған жерлерде қалыңыз. Кешке жалғыз жүрмеңіз. Сенімді көлікті пайдаланыңыз. Телефоныңызды зарядтаңыз. Инстинкттеріңізге сеніңіз - егер бір нәрсе дұрыс емес сияқты болса, аумақтан шығыңыз.',
      contentRu: 'Оставайтесь в хорошо освещенных местах. Избегайте прогулок в одиночку поздно ночью. Используйте проверенный транспорт. Держите телефон заряженным. Доверяйте своим инстинктам - если что-то кажется неправильным, покиньте это место.',
      category: 'CITY_SAFETY',
      priority: 8,
      imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
    },
    {
      title: 'Altitude Sickness Prevention',
      titleKz: 'Биіктік ауруының алдын алу',
      titleRu: 'Профилактика горной болезни',
      content: 'When visiting high-altitude areas like Shymbulak or Medeu, take time to acclimatize. Stay hydrated. Avoid alcohol. Watch for symptoms: headache, nausea, dizziness. Descend if symptoms worsen.',
      contentKz: 'Шымбұлақ немесе Медеу сияқты биік биіктіктегі аумақтарды бару кезінде, бейімделуге уақыт беріңіз. Сулықты сақтаңыз. Алкогольден аулақ болыңыз. Белгілерді бақылаңыз: бас ауруы, жүрек айну, бас айналу. Белгілер нашарласа, төменге түсіңіз.',
      contentRu: 'При посещении высокогорных районов, таких как Шымбулак или Медеу, дайте время на акклиматизацию. Поддерживайте водный баланс. Избегайте алкоголя. Следите за симптомами: головная боль, тошнота, головокружение. Спускайтесь, если симптомы ухудшаются.',
      category: 'MOUNTAIN_SAFETY',
      priority: 9,
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    },
  ];

  for (const tip of safetyTips) {
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

  console.log(`💡 Created ${safetyTips.length} safety tips`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
