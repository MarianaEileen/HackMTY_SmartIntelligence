
export interface FlightData {
  type: string;
  origin: string;
  destination: string;
  aircraft: string;
  season: 'Primavera' | 'Verano' | 'Otoño' | 'Invierno';
  duration: number; // in hours
  passengers: number;
}

export interface ConsumptionForecast {
  productName: string;
  predictedConsumption: number;
  unit: string;
}

export interface ProductivityEstimate {
    estimatedTimeMinutes: number;
    confidenceScore: number;
    factors: string[];
}

export enum ProductStatus {
    Ok = 'OK',
    Warning = 'WARNING',
    Expired = 'EXPIRED',
}

export interface ScannedProduct {
    id: string;
    name: string;
    expirationDate: Date;
    status: ProductStatus;
}
