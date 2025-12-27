import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Fetch all locations with coordinates
    // Using raw SQL to extract lat/lng from PostGIS geometry
    const locations = await prisma.$queryRaw<Array<{
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
      email: string | null;
      opening_hours: string | null;
      is_24_hours: boolean;
      image_url: string | null;
      tags: string[];
      verified: boolean;
      created_at: Date;
      updated_at: Date;
      latitude: number;
      longitude: number;
    }>>`
      SELECT 
        id,
        name,
        name_kz,
        name_ru,
        description,
        description_kz,
        description_ru,
        type,
        safety_rating,
        entry_cost,
        is_free,
        address,
        address_kz,
        address_ru,
        phone_number,
        website,
        email,
        opening_hours,
        is_24_hours,
        image_url,
        tags,
        verified,
        created_at,
        updated_at,
        ST_Y(coordinates::geometry) AS latitude,
        ST_X(coordinates::geometry) AS longitude
      FROM locations
      ORDER BY created_at DESC
      -- No LIMIT clause - fetch ALL locations
    `;

    // Transform the data to match our Location type
    const transformedLocations = locations.map((loc) => ({
      id: loc.id,
      name: loc.name,
      nameKz: loc.name_kz,
      nameRu: loc.name_ru,
      description: loc.description,
      descriptionKz: loc.description_kz,
      descriptionRu: loc.description_ru,
      latitude: Number(loc.latitude),
      longitude: Number(loc.longitude),
      type: loc.type,
      safetyRating: loc.safety_rating,
      entryCost: loc.entry_cost ? Number(loc.entry_cost) : null,
      isFree: loc.is_free,
      address: loc.address,
      addressKz: loc.address_kz,
      addressRu: loc.address_ru,
      phoneNumber: loc.phone_number,
      website: loc.website,
      email: loc.email,
      openingHours: loc.opening_hours,
      is24Hours: loc.is_24_hours,
      imageUrl: loc.image_url,
      tags: loc.tags || [],
      verified: loc.verified,
      createdAt: loc.created_at.toISOString(),
      updatedAt: loc.updated_at.toISOString(),
    }));

    return NextResponse.json(transformedLocations);
  } catch (error) {
    console.error('Error fetching locations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch locations' },
      { status: 500 }
    );
  }
}

