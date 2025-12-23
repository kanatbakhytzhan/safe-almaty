/**
 * Air Quality Index (AQI) Data for Almaty Districts
 * Simulated data for demonstration purposes
 */

export interface AQIDataPoint {
  id: string;
  district: string;
  latitude: number;
  longitude: number;
  aqiValue: number;
  status: 'Good' | 'Moderate' | 'Unhealthy';
  description: string;
}

export const ALMATY_AQI_DATA: AQIDataPoint[] = [
  {
    id: 'aqi_medeu',
    district: 'Medeu',
    latitude: 43.15,
    longitude: 76.95,
    aqiValue: 35,
    status: 'Good',
    description: 'Mountain area with excellent air quality',
  },
  {
    id: 'aqi_abay',
    district: 'Abay',
    latitude: 43.25,
    longitude: 76.92,
    aqiValue: 85,
    status: 'Moderate',
    description: 'Moderate air quality in central district',
  },
  {
    id: 'aqi_dostyk',
    district: 'Dostyk',
    latitude: 43.22,
    longitude: 76.88,
    aqiValue: 95,
    status: 'Moderate',
    description: 'Moderate air quality near city center',
  },
  {
    id: 'aqi_sayahat',
    district: 'Sayahat',
    latitude: 43.18,
    longitude: 76.85,
    aqiValue: 145,
    status: 'Unhealthy',
    description: 'Lower city area with poor air quality',
  },
  {
    id: 'aqi_almaly',
    district: 'Almaly',
    latitude: 43.24,
    longitude: 76.90,
    aqiValue: 110,
    status: 'Unhealthy',
    description: 'Dense urban area with elevated pollution',
  },
  {
    id: 'aqi_turksib',
    district: 'Turksib',
    latitude: 43.20,
    longitude: 76.93,
    aqiValue: 78,
    status: 'Moderate',
    description: 'Moderate air quality in residential area',
  },
  {
    id: 'aqi_bostandyk',
    district: 'Bostandyk',
    latitude: 43.28,
    longitude: 76.95,
    aqiValue: 42,
    status: 'Good',
    description: 'Good air quality in elevated district',
  },
  {
    id: 'aqi_nauryzbay',
    district: 'Nauryzbay',
    latitude: 43.16,
    longitude: 76.87,
    aqiValue: 125,
    status: 'Unhealthy',
    description: 'Industrial area with poor air quality',
  },
];

export function getAQIColor(aqiValue: number): string {
  if (aqiValue <= 50) {
    return '#10b981'; // Green - Good
  } else if (aqiValue <= 100) {
    return '#f59e0b'; // Yellow - Moderate
  } else {
    return '#ef4444'; // Red - Unhealthy
  }
}

export function getAQIStatus(aqiValue: number): 'Good' | 'Moderate' | 'Unhealthy' {
  if (aqiValue <= 50) {
    return 'Good';
  } else if (aqiValue <= 100) {
    return 'Moderate';
  } else {
    return 'Unhealthy';
  }
}

