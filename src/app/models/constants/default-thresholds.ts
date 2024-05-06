export const DefaultThresholds = {
    thresholds: [
      {
        name: 'Temperature (°C)',
        minValue: -20,
        maxValue: 60,
        currentLowValue: -20,
        currentHighValue: 60,
      },
      {
        name: 'Moisture (%)',
        minValue: 0,
        maxValue: 100,
        currentLowValue: 0,
        currentHighValue: 100,
      },
      {
        name: 'Salinity (µS/cm)',
        minValue: 0,
        maxValue: 1200,
        currentLowValue: 0,
        currentHighValue: 1200,
      },
      {
        name: 'pH',
        minValue: 0,
        maxValue: 14,
        currentLowValue: 0,
        currentHighValue: 14,
      },
      {
        name: 'Nitrogen (mg/kg)',
        minValue: 0,
        maxValue: 200,
        currentLowValue: 0,
        currentHighValue: 200,
      },
      {
        name: 'Phosphorus (mg/kg)',
        minValue: 0,
        maxValue: 250,
        currentLowValue: 0,
        currentHighValue: 250,
      },
      {
        name: 'Potassium (mg/kg)',
        minValue: 0,
        maxValue: 500,
        currentLowValue: 0,
        currentHighValue: 500,
      },
    ],
  };
  
  export const conditionsMapping = [
    {
      name: 'Temperature (°C)',
      minKey: 'temperatureMin',
      maxKey: 'temperatureMax',
    },
    { name: 'Moisture (%)', minKey: 'moistureMin', maxKey: 'moistureMax' },
    { name: 'Salinity (µS/cm)', minKey: 'ecMin', maxKey: 'ecMax' },
    { name: 'pH', minKey: 'phMin', maxKey: 'phMax' },
    { name: 'Nitrogen (mg/kg)', minKey: 'nitrogenMin', maxKey: 'nitrogenMax' },
    {
      name: 'Phosphorus (mg/kg)',
      minKey: 'phosphorusMin',
      maxKey: 'phosphorusMax',
    },
    {
      name: 'Potassium (mg/kg)',
      minKey: 'potassiumMin',
      maxKey: 'potassiumMax',
    },
  ];