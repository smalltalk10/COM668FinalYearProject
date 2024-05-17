export interface SensorData {
    Body: {
      datetime: string;
      moisture: number;
      temperature: number;
      ec: number;
      ph: number;
      nitrogen: number;
      phosphorus: number;
      potassium: number;
    };
  }
  
export interface StatisticsData {
    moisture: number[];
    temperature: number[];
    ec: number[];
    ph: number[];
    nitrogen: number[];
    phosphorus: number[];
    potassium: number[];
  }
  