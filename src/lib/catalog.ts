export type ServiceType = 'airport-to-location' | 'location-to-airport' | 'location-to-location' | 'self-drive' | 'chauffeur';
export type VehicleId = 'sedan' | 'premium' | 'suv' | 'seven' | 'van' | 'self-drive' | 'chauffeur';

export interface Vehicle { id: VehicleId; name: string; subtitle: string; seats: number; bags: number; multiplier: number; color: number; body: 'sedan'|'premium'|'suv'|'mpv'|'van'; services: ServiceType[] }
const passenger = ['airport-to-location','location-to-airport','location-to-location'] as ServiceType[];
export const vehicles: Vehicle[] = [
  { id:'sedan', name:'Sedan', subtitle:'Quiet electric city car', seats:4, bags:2, multiplier:1, color:0xd8d9d6, body:'sedan', services:passenger },
  { id:'premium', name:'Premium Sedan', subtitle:'Executive long-wheelbase cabin', seats:4, bags:3, multiplier:1.55, color:0x1b2228, body:'premium', services:[...passenger,'chauffeur'] },
  { id:'suv', name:'SUV', subtitle:'Raised all-weather comfort', seats:5, bags:4, multiplier:1.35, color:0x32483f, body:'suv', services:passenger },
  { id:'seven', name:'7-Seater', subtitle:'Full-size three-row electric MPV', seats:7, bags:4, multiplier:1.72, color:0x695d50, body:'mpv', services:[...passenger,'chauffeur'] },
  { id:'van', name:'Luxury MPV / Van', subtitle:'Group travel with generous luggage room', seats:6, bags:7, multiplier:1.95, color:0x17191c, body:'van', services:[...passenger,'chauffeur'] },
  { id:'self-drive', name:'Self-Drive', subtitle:'Electric crossover rental', seats:5, bags:3, multiplier:1.2, color:0xb8c4b7, body:'suv', services:['self-drive'] },
  { id:'chauffeur', name:'Chauffeur', subtitle:'Premium sedan with professional driver', seats:4, bags:3, multiplier:1.8, color:0x22242b, body:'premium', services:['chauffeur'] }
];
export const places = [
  { id:'airport', name:'Taoyuan International Airport', node:'airport' },
  { id:'taipei101', name:'Taipei 101', node:'tower' },
  { id:'station', name:'Taipei Main Station', node:'station' },
  { id:'hotel', name:'Riverside Hotel', node:'hotel' },
  { id:'district', name:'Xinyi District', node:'xinyi' }
] as const;
export function estimateFare(distanceKm:number, vehicle:Vehicle, service:ServiceType) {
  const base = service === 'self-drive' ? 1450 : service === 'chauffeur' ? 720 : 420;
  return Math.round((base + distanceKm * (service === 'self-drive' ? 9 : 31)) * vehicle.multiplier / 10) * 10;
}
