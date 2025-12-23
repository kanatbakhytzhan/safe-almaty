import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const lat = parseFloat(searchParams.get('lat') || '0');
    const lng = parseFloat(searchParams.get('lng') || '0');
    const type = searchParams.get('type') || 'POLICE_STATION';

    if (!lat || !lng) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      );
    }

    // PostGIS query to find nearest location using ST_DistanceSphere
    // Using $queryRaw with template literals for proper parameterization
    const result = await prisma.$queryRaw<Array<{
      id: string;
      name: string;
      name_kz: string | null;
      name_ru: string | null;
      description: string | null;
      description_kz: string | null;
      description_ru: string | null;
      type: string;
      safety_rating: string;
      entry_cost: number | null;
      is_free: boolean;
      address: string | null;
      address_kz: string | null;
      address_ru: string | null;
      phone_number: string | null;
      website: string | null;
      is_24_hours: boolean;
      image_url: string | null;
      verified: boolean;
      latitude: number;
      longitude: number;
      distance_meters: number;
    }>>`
      SELECT 
        l.id,
        l.name,
        l.name_kz,
        l.name_ru,
        l.description,
        l.description_kz,
        l.description_ru,
        l.type,
        l.safety_rating,
        l.entry_cost,
        l.is_free,
        l.address,
        l.address_kz,
        l.address_ru,
        l.phone_number,
        l.website,
        l.is_24_hours,
        l.image_url,
        l.verified,
        ST_Y(l.coordinates::geometry) as latitude,
        ST_X(l.coordinates::geometry) as longitude,
        ST_DistanceSphere(
          l.coordinates::geometry,
          ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)
        ) as distance_meters
      FROM locations l
      WHERE l.type = ${type}::"LocationType"
      ORDER BY l.coordinates::geometry <-> ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)
      LIMIT 1
    `;

    if (!result || result.length === 0) {
      return NextResponse.json(
        { error: `No ${type} found nearby` },
        { status: 404 }
      );
    }

    const location = result[0];

    return NextResponse.json({
      location: {
        id: location.id,
        name: location.name,
        nameKz: location.name_kz,
        nameRu: location.name_ru,
        description: location.description,
        descriptionKz: location.description_kz,
        descriptionRu: location.description_ru,
        latitude: location.latitude,
        longitude: location.longitude,
        type: location.type,
        safetyRating: location.safety_rating,
        entryCost: location.entry_cost,
        isFree: location.is_free,
        address: location.address,
        addressKz: location.address_kz,
        addressRu: location.address_ru,
        phoneNumber: location.phone_number,
        website: location.website,
        is24Hours: location.is_24_hours,
        imageUrl: location.image_url,
        verified: location.verified,
      },
      distanceMeters: Math.round(location.distance_meters),
    });
  } catch (error) {
    console.error('Error finding nearest location:', error);
    return NextResponse.json(
      { error: 'Failed to find nearest location' },
      { status: 500 }
    );
  }
}

