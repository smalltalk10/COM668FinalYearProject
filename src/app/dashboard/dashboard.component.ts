import { Component, OnInit } from '@angular/core';
import { WebService } from '../web.service';
import { Observable, interval } from 'rxjs';
import { switchMap, startWith } from 'rxjs/operators';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})

export class DashboardComponent implements OnInit {
  current_measurements!: Observable<any>;
  decodedToken: any;
  sessionStorage: Storage = window.sessionStorage;
  zoom = 12;
  mapCenter: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
  markerPosition: google.maps.LatLngLiteral = this.mapCenter;
  currentPosition: any;
  isLocationLoaded = false;
  initialPosition: any;

  constructor(public webService: WebService) {}

  ngOnInit() {
    this.loadCurrentMeasurements();
    this.loadLocation();
    this.webService.fetchAllDateRangeMeasurements().subscribe();
  }

  loadCurrentMeasurements() {
    this.current_measurements = interval(60000).pipe(
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
    this.initialPosition = { lat: latitude, lng: longitude };
    if (!isNaN(latitude) && !isNaN(longitude)) {
      this.updateMapLocation(latitude, longitude);
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
      this.currentPosition = `deviceID: ${ sessionStorage.getItem('deviceID')}, Lat: ${this.markerPosition.lat} Lng: ${this.markerPosition.lng}`;
    }
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

  
  temperatureThresholds = {
    '0': { color: 'red', bgOpacity: 0.2 },
    '5': { color: 'orange', bgOpacity: 0.2 },
    '15': { color: 'green', bgOpacity: 0.2 },
    '25': { color: 'orange', bgOpacity: 0.2 },
    '40': { color: 'red', bgOpacity: 0.2 },
  };

  temperatureMarkers = {
    '0': { color: '#555', size: 4, label: '0', font: '12px arial' },
    '10': { color: '#555', size: 4, label: '10', font: '12px arial' },
    '15': { color: '#555', size: 4, label: '15', font: '12px arial' },
    '25': { color: '#555', size: 4, label: '25', font: '12px arial' },
    '40': { color: '#555', size: 4, label: '40', font: '12px arial' },
    '60': { color: '#555', size: 4, label: '60+', font: '12px arial' },
  };

  moistureThresholds = {
    '0': { color: 'red', bgOpacity: 0.2 },
    '10': { color: 'orange', bgOpacity: 0.2 },
    '20': { color: 'green', bgOpacity: 0.2 },
    '70': { color: 'orange', bgOpacity: 0.2 },
    '80': { color: 'red', bgOpacity: 0.2 },
  };

  moistureMarkers = {
    '0': { color: '#555', size: 4, label: '0', font: '12px arial' },
    '10': { color: '#555', size: 4, label: '10', font: '12px arial' },
    '20': { color: '#555', size: 4, label: '20', font: '12px arial' },
    '70': { color: '#555', size: 4, label: '70', font: '12px arial' },
    '80': { color: '#555', size: 4, label: '80', font: '12px arial' },
    '100': { color: '#555', size: 4, label: '100', font: '12px arial' },
  };

  salinityThresholds = {
    '0': { color: 'red', bgOpacity: 0.2 },
    '100': { color: 'orange', bgOpacity: 0.2 },
    '200': { color: 'green', bgOpacity: 0.2 },
    '800': { color: 'orange', bgOpacity: 0.2 },
    '1000': { color: 'red', bgOpacity: 0.2 },
  };

  salinityMarkers = {
    '0': { color: '#555', size: 4, label: '0', font: '12px arial' },
    '100': { color: '#555', size: 4, label: '100', font: '12px arial' },
    '200': { color: '#555', size: 4, label: '200', font: '12px arial' },
    '800': { color: '#555', size: 4, label: '800', font: '12px arial' },
    '1000': { color: '#555', size: 4, label: '1000', font: '12px arial' },
    '1200': { color: '#555', size: 4, label: '1200+', font: '12px arial' },
  };

  phThresholds = {
    '0': { color: 'red', bgOpacity: 0.2 },
    '3.5': { color: 'orange', bgOpacity: 0.2 },
    '5': { color: 'green', bgOpacity: 0.2 },
    '8': { color: 'orange', bgOpacity: 0.2 },
    '10': { color: 'red', bgOpacity: 0.2 },
  };

  phMarkers = {
    '0': { color: '#555', size: 4, label: '0', font: '12px arial' },
    '3.5': { color: '#555', size: 4, label: '3.5', font: '12px arial' },
    '5': { color: '#555', size: 4, label: '5', font: '12px arial' },
    '8': { color: '#555', size: 4, label: '8', font: '12px arial' },
    '10': { color: '#555', size: 4, label: '10', font: '12px arial' },
    '14': { color: '#555', size: 4, label: '14', font: '12px arial' },
  };

  nitrogenThresholds = {
    '0': { color: 'red', bgOpacity: 0.2 },
    '10': { color: 'orange', bgOpacity: 0.2 },
    '20': { color: 'green', bgOpacity: 0.2 },
    '60': { color: 'orange', bgOpacity: 0.4 },
    '80': { color: 'red', bgOpacity: 0.4 },
  };

  nitrogenMarkers = {
    '0': { color: '#555', size: 4, label: '0', font: '12px arial' },
    '10': { color: '#555', size: 3, label: '10', font: '12px arial' },
    '20': { color: '#555', size: 4, label: '20', font: '12px arial' },
    '60': { color: '#555', size: 4, label: '60', font: '12px arial' },
    '80': { color: '#555', size: 4, label: '80', font: '12px arial' },
    '100': { color: '#555', size: 4, label: '100+', font: '12px arial' },
  };

  phosphorusThresholds = {
    '0': { color: 'red', bgOpacity: 0.2 },
    '30': { color: 'orange', bgOpacity: 0.2 },
    '50': { color: 'green', bgOpacity: 0.2 },
    '200': { color: 'orange', bgOpacity: 0.4 },
    '250': { color: 'red', bgOpacity: 0.4 },
  };

  phosphorusMarkers = {
    '0': { color: '#555', size: 4, label: '0', font: '12px arial' },
    '30': { color: '#555', size: 3, label: '30', font: '12px arial' },
    '50': { color: '#555', size: 4, label: '50', font: '12px arial' },
    '200': { color: '#555', size: 4, label: '150', font: '12px arial' },
    '250': { color: '#555', size: 4, label: '200', font: '12px arial' },
    '300': { color: '#555', size: 4, label: '250+', font: '12px arial' },
  };

  potassiumThresholds = {
    '0': { color: 'red', bgOpacity: 0.2 },
    '100': { color: 'orange', bgOpacity: 0.2 },
    '150': { color: 'green', bgOpacity: 0.2 },
    '350': { color: 'orange', bgOpacity: 0.4 },
    '400': { color: 'red', bgOpacity: 0.4 },
  };

  potassiumMarkers = {
    '0': { color: '#555', size: 4, label: '0', font: '12px arial' },
    '100': { color: '#555', size: 3, label: '100', font: '12px arial' },
    '150': { color: '#555', size: 4, label: '150', font: '12px arial' },
    '350': { color: '#555', size: 4, label: '350', font: '12px arial' },
    '400': { color: '#555', size: 4, label: '400', font: '12px arial' },
    '500': { color: '#555', size: 4, label: '500+', font: '12px arial' },
  };
}
