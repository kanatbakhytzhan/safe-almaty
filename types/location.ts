export interface Location {
  id: string;
  name: string;
  nameKz?: string | null;
  nameRu?: string | null;
  description?: string | null;
  descriptionKz?: string | null;
  descriptionRu?: string | null;
  latitude: number;
  longitude: number;
  type: string;
  safetyRating: string;
  entryCost?: number | null;
  isFree: boolean;
  address?: string | null;
  addressKz?: string | null;
  addressRu?: string | null;
  phoneNumber?: string | null;
  website?: string | null;
  email?: string | null;
  openingHours?: string | null;
  is24Hours: boolean;
  imageUrl?: string | null;
  tags: string[];
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

