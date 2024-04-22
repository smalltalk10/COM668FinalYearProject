import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { WebService } from '../../../web.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-device-modal',
  templateUrl: './device.modal.component.html',
  styleUrls: ['./device.modal.component.css'],
})
export class DeviceModalComponent implements OnInit {
  decodedToken: any;
  lat: string = '';
  lng: string = '';
  currentMeasurements!: Observable<any>;

  constructor(
    public webService: WebService,
    public activeModal: NgbActiveModal,
    public router: Router
  ) {}

  ngOnInit() {
    const token = sessionStorage.getItem('token');
    if (token) {
      this.decodedToken = jwtDecode(token);
    } else {
      this.router.navigateByUrl('/');
    }

    this.lat = sessionStorage.getItem('lat') || 'Not available';
    this.lng = sessionStorage.getItem('lng') || 'Not available';

    this.currentMeasurements = this.webService.getCurrentMeasurements();
  }

  getOnlineStatus(datetime: string): string {
    const minutesDiff = (new Date().getTime() - new Date(datetime).getTime()) / 60000;
    return minutesDiff < 10 ? 'Online' : 'Offline';
  }

  getRelativeTime(datetime: string): string {
    const currentTime = new Date();
    const lastUpdatedTime = new Date(datetime);
    const minutesDiff = Math.floor((currentTime.getTime() - lastUpdatedTime.getTime()) / 60000);
  
    return minutesDiff < 1 ? '<1 min ago' : `${minutesDiff} mins ago`;
  }
}
