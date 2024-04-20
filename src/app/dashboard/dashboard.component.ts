import { Component, OnInit } from '@angular/core';
import { WebService } from '../web.service';
import { Observable, interval } from 'rxjs';
import { switchMap, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';
import { GaugeSettings } from '../models/constants/guage-settings';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  currentMeasurements!: Observable<any>;
  initialPosition: any;
  currentWeather: any;
  currentAstro: any;

  zoom = 12;
  mapCenter: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
  markerPosition: google.maps.LatLngLiteral = this.mapCenter;
  currentPosition: any;
  isLocationLoaded = false;
  isWeatherLoaded = false;
  deviceID = sessionStorage.getItem('deviceID');

  gaugeSettings: {
    [key: string]: {
      thresholds: { [key: string]: any };
      markers: { [key: string]: any };
    };
  } = GaugeSettings;

  gauges = [
    { name: 'Temperature', key: 'temperature', unit: '°C', max: 60 },
    { name: 'Moisture', key: 'moisture', unit: '%', max: 100 },
    { name: 'Salinity', key: 'ec', unit: 'µS/cm', max: 1200 },
    { name: 'pH', key: 'ph', unit: 'PH', max: 14 },
    { name: 'Nitrogen', key: 'nitrogen', unit: 'mg/kg', max: 100 },
    { name: 'Phosphorus', key: 'phosphorus', unit: 'mg/kg', max: 300 },
    { name: 'Potassium', key: 'potassium', unit: 'mg/kg', max: 500 },
  ];

  constructor(public webService: WebService, private router: Router) {}

  ngOnInit() {
    const token = sessionStorage.getItem('token');
    if (!token) {
      this.router.navigateByUrl('/');
    }
    this.loadCurrentMeasurements();
    this.loadLocation();
    this.webService.getAllDateRangeMeasurements().subscribe();
  }

  loadCurrentMeasurements() {
    this.currentMeasurements = interval(60000).pipe(
      startWith(0),
      switchMap(() => this.webService.getCurrentMeasurements())
    );
  }

  loadLocation() {
    this.webService.getLocation().subscribe({
      next: (response: any) => this.handleLocationResponse(response),
      error: (error) => console.error('Received invalid coordinates:', error),
    });
  }

  handleLocationResponse(response: any) {
    const latitude = parseFloat(response.lat);
    const longitude = parseFloat(response.lng);
    sessionStorage.setItem('lat', latitude.toString());
    sessionStorage.setItem('lng', longitude.toString());
    this.initialPosition = { lat: latitude, lng: longitude };
    if (!isNaN(latitude) && !isNaN(longitude)) {
      this.updateMapLocation(latitude, longitude);
      this.loadCurrentWeather(latitude, longitude);
    }
  }

  updateMapLocation(lat: number, lng: number) {
    this.mapCenter = { lat, lng };
    this.markerPosition = this.mapCenter;
    this.updateCurrentPosition();
    this.isLocationLoaded = true;
  }

  updateCurrentPosition() {
    if (this.markerPosition) {
      this.currentPosition = `deviceID: ${sessionStorage.getItem(
        'deviceID'
      )}, Lat: ${this.markerPosition.lat} Lng: ${this.markerPosition.lng}`;
    }
  }

  loadCurrentWeather(lat: number, lng: number) {
    this.webService.getCurrentWeather(lat, lng).subscribe({
      next: (response: any) => {
        this.currentWeather = response.currentWeather;
        this.currentAstro = response.astroData.astronomy;
        this.isWeatherLoaded = true;
      },
      error: (error) =>
        console.error('Received invalid weather response:', error),
    });
  }

  onMapClick(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      this.updateMapLocation(event.latLng.lat(), event.latLng.lng());
    }
  }

  positionsAreDifferent(): boolean {
    if (!this.initialPosition) return false;
    return (
      this.initialPosition.lat !== this.markerPosition.lat ||
      this.initialPosition.lng !== this.markerPosition.lng
    );
  }

  onSubmitUpdateLocation() {
    this.webService.updateLocation(this.markerPosition).subscribe({
      next: () => this.loadLocation(),
      error: (error) => console.error('HTTP error:', error),
    });
  }
}
