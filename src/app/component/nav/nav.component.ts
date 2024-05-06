import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { WebService } from '../../web.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeviceModalComponent } from './deviceModal/device.modal.component';
import { ThresholdModalComponent } from './thresholdModal/threshold.modal.component';
import { UserProfileModalComponent } from './userProfileModal/userProfile.modal.component';

@Component({
  selector: 'navigation',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent {
  constructor(
    public webService: WebService,
    public router: Router,
    private modalService: NgbModal
  ) {}

  sessionStorage: Storage = window.sessionStorage;

  onOpenDeviceModal() {
    this.modalService.open(DeviceModalComponent, { size: 'lg' });
  }


  onOpenThresholdModal() {
    this.modalService.open(ThresholdModalComponent, {
      windowClass: 'custom-large-modal',
    });
  }

  onOpenUserProfileModal() {
    this.modalService.open(UserProfileModalComponent, { size: 'lg' });
  }

  onSubmitLogout() {
    {
      this.router.navigateByUrl('/');
      this.sessionStorage.setItem('token', '');
    }
  }
}
