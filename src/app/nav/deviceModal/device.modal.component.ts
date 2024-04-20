import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { WebService } from '../../web.service';


@Component({
  selector: 'app-login-modal',
  templateUrl: './device.modal.component.html',
  styleUrls: ['./../device.modal.component.css'],
})
export class DeviceModalComponent {
  constructor(
    public webService: WebService,
    public activeModal: NgbActiveModal,
  ) {}

}