export interface Threshold {
    id: string;
    name: string;
    temperatureMin: number;
    temperatureMax: number;
    moistureMin: number;
    moistureMax: number;
    ecMin: number;
    ecMax: number;
    phMin: number;
    phMax: number;
    nitrogenMin: number;
    nitrogenMax: number;
    phosphorusMin: number;
    phosphorusMax: number;
    potassiumMin: number;
    potassiumMax: number;
    isActive?: string;
  }
  
  export interface ThresholdData {
    value: Threshold[];
  }