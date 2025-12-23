/**
 * Location Type Constants
 */

export enum LocationType {
  HOSPITAL = 'HOSPITAL',
  POLICE_STATION = 'POLICE_STATION',
  FIRE_STATION = 'FIRE_STATION',
  TOURIST_SPOT = 'TOURIST_SPOT',
  SAFE_ZONE = 'SAFE_ZONE',
  EVACUATION_POINT = 'EVACUATION_POINT',
  MOUNTAIN_SHELTER = 'MOUNTAIN_SHELTER',
  RESCUE_POINT = 'RESCUE_POINT',
  RESTAURANT = 'RESTAURANT',
  HOTEL = 'HOTEL',
  TRANSPORT_HUB = 'TRANSPORT_HUB',
  MOUNTAIN_AREA = 'MOUNTAIN_AREA',
  CITY_AREA = 'CITY_AREA',
  OTHER = 'OTHER',
}

export enum SafetyRating {
  VERY_SAFE = 'VERY_SAFE',
  SAFE = 'SAFE',
  MODERATE = 'MODERATE',
  CAUTION = 'CAUTION',
  UNSAFE = 'UNSAFE',
}

export const LOCATION_TYPE_LABELS: Record<LocationType, string> = {
  [LocationType.HOSPITAL]: 'Hospital',
  [LocationType.POLICE_STATION]: 'Police Station',
  [LocationType.FIRE_STATION]: 'Fire Station',
  [LocationType.TOURIST_SPOT]: 'Tourist Spot',
  [LocationType.SAFE_ZONE]: 'Safe Zone',
  [LocationType.EVACUATION_POINT]: 'Evacuation Point',
  [LocationType.MOUNTAIN_SHELTER]: 'Mountain Shelter',
  [LocationType.RESCUE_POINT]: 'Rescue Point',
  [LocationType.RESTAURANT]: 'Restaurant',
  [LocationType.HOTEL]: 'Hotel',
  [LocationType.TRANSPORT_HUB]: 'Transport Hub',
  [LocationType.MOUNTAIN_AREA]: 'Mountain Area',
  [LocationType.CITY_AREA]: 'City Area',
  [LocationType.OTHER]: 'Other',
};

export const SAFETY_RATING_LABELS: Record<SafetyRating, string> = {
  [SafetyRating.VERY_SAFE]: 'Very Safe',
  [SafetyRating.SAFE]: 'Safe',
  [SafetyRating.MODERATE]: 'Moderate',
  [SafetyRating.CAUTION]: 'Caution',
  [SafetyRating.UNSAFE]: 'Unsafe',
};

