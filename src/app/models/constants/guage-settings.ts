export const GaugeSettings = {
    temperature: {
      thresholds: {
        '0': { color: 'red', bgOpacity: 0.2 },
        '5': { color: 'orange', bgOpacity: 0.2 },
        '15': { color: 'green', bgOpacity: 0.2 },
        '25': { color: 'orange', bgOpacity: 0.2 },
        '40': { color: 'red', bgOpacity: 0.2 },
      },
      markers: {
        '0': { color: '#555', size: 4, label: '0', font: '12px arial' },
        '10': { color: '#555', size: 4, label: '10', font: '12px arial' },
        '15': { color: '#555', size: 4, label: '15', font: '12px arial' },
        '25': { color: '#555', size: 4, label: '25', font: '12px arial' },
        '40': { color: '#555', size: 4, label: '40', font: '12px arial' },
        '60': { color: '#555', size: 4, label: '60+', font: '12px arial' },
      },
    },
    moisture: {
      thresholds: {
        '0': { color: 'red', bgOpacity: 0.2 },
        '10': { color: 'orange', bgOpacity: 0.2 },
        '20': { color: 'green', bgOpacity: 0.2 },
        '70': { color: 'orange', bgOpacity: 0.2 },
        '80': { color: 'red', bgOpacity: 0.2 },
      },
      markers: {
        '0': { color: '#555', size: 4, label: '0', font: '12px arial' },
        '10': { color: '#555', size: 4, label: '10', font: '12px arial' },
        '20': { color: '#555', size: 4, label: '20', font: '12px arial' },
        '70': { color: '#555', size: 4, label: '70', font: '12px arial' },
        '80': { color: '#555', size: 4, label: '80', font: '12px arial' },
        '100': { color: '#555', size: 4, label: '100', font: '12px arial' },
      },
    },
    ec: {
      thresholds: {
        '0': { color: 'red', bgOpacity: 0.2 },
        '100': { color: 'orange', bgOpacity: 0.2 },
        '400': { color: 'green', bgOpacity: 0.2 },
        '800': { color: 'orange', bgOpacity: 0.2 },
        '1000': { color: 'red', bgOpacity: 0.2 },
      },
      markers: {
        '0': { color: '#555', size: 4, label: '0', font: '12px arial' },
        '100': { color: '#555', size: 4, label: '100', font: '12px arial' },
        '400': { color: '#555', size: 4, label: '400', font: '12px arial' },
        '800': { color: '#555', size: 4, label: '800', font: '12px arial' },
        '1000': { color: '#555', size: 4, label: '1000', font: '12px arial' },
        '1200': { color: '#555', size: 4, label: '1200+', font: '12px arial' },
      },
    },
    ph: {
      thresholds: {
        '0': { color: 'red', bgOpacity: 0.2 },
        '3.5': { color: 'orange', bgOpacity: 0.2 },
        '5': { color: 'green', bgOpacity: 0.2 },
        '8': { color: 'orange', bgOpacity: 0.2 },
        '10': { color: 'red', bgOpacity: 0.2 },
      },
      markers: {
        '0': { color: '#555', size: 4, label: '0', font: '12px arial' },
        '3.5': { color: '#555', size: 4, label: '3.5', font: '12px arial' },
        '5': { color: '#555', size: 4, label: '5', font: '12px arial' },
        '8': { color: '#555', size: 4, label: '8', font: '12px arial' },
        '10': { color: '#555', size: 4, label: '10', font: '12px arial' },
        '14': { color: '#555', size: 4, label: '14', font: '12px arial' },
      },
    },
    nitrogen: {
        thresholds: {
          '0': { color: 'red', bgOpacity: 0.2 },
          '10': { color: 'orange', bgOpacity: 0.2 },
          '30': { color: 'green', bgOpacity: 0.2 },
          '60': { color: 'orange', bgOpacity: 0.2 },
          '80': { color: 'red', bgOpacity: 0.2 },
        },
        markers: {
          '0': { color: '#555', size: 4, label: '0', font: '12px arial' },
          '15': { color: '#555', size: 3, label: '15', font: '12px arial' },
          '30': { color: '#555', size: 4, label: '30', font: '12px arial' },
          '60': { color: '#555', size: 4, label: '60', font: '12px arial' },
          '80': { color: '#555', size: 4, label: '80', font: '12px arial' },
          '100': { color: '#555', size: 4, label: '100+', font: '12px arial' },
        },
      },
      phosphorus: {
        thresholds: {
          '0': { color: 'red', bgOpacity: 0.2 },
          '30': { color: 'orange', bgOpacity: 0.2 },
          '50': { color: 'green', bgOpacity: 0.2 },
          '200': { color: 'orange', bgOpacity: 0.2 },
          '250': { color: 'red', bgOpacity: 0.2 },
        },
        markers: {
          '0': { color: '#555', size: 4, label: '0', font: '12px arial' },
          '30': { color: '#555', size: 3, label: '30', font: '12px arial' },
          '50': { color: '#555', size: 4, label: '50', font: '12px arial' },
          '200': { color: '#555', size: 4, label: '150', font: '12px arial' },
          '250': { color: '#555', size: 4, label: '200', font: '12px arial' }, 
          '300': { color: '#555', size: 4, label: '250+', font: '12px arial' },
        },
      },
      potassium: {
        thresholds: {
          '0': { color: 'red', bgOpacity: 0.2 },
          '100': { color: 'orange', bgOpacity: 0.2 },
          '150': { color: 'green', bgOpacity: 0.2 },
          '350': { color: 'orange', bgOpacity: 0.2 },
          '400': { color: 'red', bgOpacity: 0.2 },
        },
        markers: {
          '0': { color: '#555', size: 4, label: '0', font: '12px arial' },
          '100': { color: '#555', size: 3, label: '100', font: '12px arial' },
          '150': { color: '#555', size: 4, label: '150', font: '12px arial' },
          '350': { color: '#555', size: 4, label: '350', font: '12px arial' },
          '400': { color: '#555', size: 4, label: '400', font: '12px arial' },
          '500': { color: '#555', size: 4, label: '500+', font: '12px arial' },
        },
      },
    };
  
export default GaugeSettings;
  