import { Component, OnInit } from '@angular/core';
import { WebService } from '../../web.service';
import { AgChartOptions } from 'ag-charts-community';
import { Router } from '@angular/router';

interface ForecastDay {
  date: string;
  day: {
    avghumidity: number;
    avgtemp_c: number;
    maxtemp_c: number;
    mintemp_c: number;
    uv: number;
    maxwind_mph: number;
    daily_chance_of_rain: number;
    totalprecip_mm: number;
    condition: {
      text: string;
      icon: string;
    };
  };
}

interface WeatherForecast {
  location: {
    name: string;
    country: string;
  };
  forecast: {
    forecastday: ForecastDay[];
  };
}

@Component({
  selector: 'forecast-component',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.css'],
})
export class ForecastComponent implements OnInit {
  forecastedWeather!: WeatherForecast;
  public temperatureChartOptions: AgChartOptions | null = null;
  public precipitationChartOptions: AgChartOptions | null = null;
  deviceID = sessionStorage.getItem('deviceID')

  constructor(private webService: WebService,
    private router: Router
  ) {}

  ngOnInit() {
    const token = sessionStorage.getItem('token');
    if (!token) {
      this.router.navigateByUrl('/');
    }
    this.loadForecastedWeather();
  }

  loadForecastedWeather() {
    const latString = sessionStorage.getItem('lat');
    const lngString = sessionStorage.getItem('lng');

    if (latString === null || lngString === null) {
      console.error('Latitude or longitude is missing from session storage.');
      return;
    }

    const lat = parseFloat(latString);
    const lng = parseFloat(lngString);

    this.webService.getForecastedWeather(lat, lng).subscribe({
      next: (response: any) => {
        this.forecastedWeather = response as WeatherForecast;
        this.setupTemperatureChart();
        this.setupPrecipitationChart();
      },
      error: (error: any) =>
        console.error('Received invalid weather response:', error),
    });
  }

  setupTemperatureChart() {
    const categories = this.forecastedWeather.forecast.forecastday.map(
      (day) => day.date
    );
    const avgTemps = this.forecastedWeather.forecast.forecastday.map(
      (day) => day.day.avgtemp_c
    );
    const maxTemps = this.forecastedWeather.forecast.forecastday.map(
      (day) => day.day.maxtemp_c
    );
    const minTemps = this.forecastedWeather.forecast.forecastday.map(
      (day) => day.day.mintemp_c
    );

    this.temperatureChartOptions = {
      data: categories.map((category, i) => ({
        category,
        avgTemp: avgTemps[i],
        maxTemp: maxTemps[i],
        minTemp: minTemps[i],
      })),
      series: [
        {
          type: 'line',
          xKey: 'category',
          yKey: 'avgTemp',
          yName: 'Average Temp (°C)',
          marker: { enabled: false },
        },
        {
          type: 'line',
          xKey: 'category',
          yKey: 'maxTemp',
          yName: 'Max Temp (°C)',
          marker: { enabled: false },
        },
        {
          type: 'line',
          xKey: 'category',
          yKey: 'minTemp',
          yName: 'Min Temp (°C)',
          marker: { enabled: false },
        },
      ],
      axes: [
        {
          type: 'category',
          position: 'bottom',
          title: { text: 'Date' },
        },
        {
          type: 'number',
          position: 'left',
          title: { text: 'Temperature (°C)' },
        },
      ],
      legend: {
        position: 'top',
      },
    };
  }
  
  setupPrecipitationChart() {
    const categories = this.forecastedWeather.forecast.forecastday.map(
      (day) => day.date
    );
    const rainChances = this.forecastedWeather.forecast.forecastday.map(
      (day) => day.day.daily_chance_of_rain
    );
    const rainfallAmounts = this.forecastedWeather.forecast.forecastday.map(
      (day) => day.day.totalprecip_mm
    );
  
    this.precipitationChartOptions = {
      data: categories.map((category, i) => ({
        category,
        ChanceOfRain: rainChances[i],
        Rainfall: rainfallAmounts[i],
      })),
      series: [
        {
          type: 'bar',
          xKey: 'category',
          yKey: 'ChanceOfRain',
          yName: 'Chance of Rain (%)',
          cornerRadius: 10,
          label: {
            formatter: ({ value }) => `${value}%`,
          },
          tooltip: {
            renderer: ({ datum }) => {
              return { 
                title: datum.category, 
                content: `Chance of Rain: ${datum.ChanceOfRain}%\nRainfall: ${datum.Rainfall} mm` 
              };
            },
          },
        }
      ],
      axes: [
        {
          type: 'category',
          position: 'bottom',
          title: { text: 'Date' },
        },
        {
          type: 'number',
          position: 'left',
          title: { text: 'Chance of Rain (%)' },
          label: {
            formatter: ({ value }) => `${value}%`
          }
        },
      ],
      legend: {
        position: 'top',
      },
    };
  }
}
