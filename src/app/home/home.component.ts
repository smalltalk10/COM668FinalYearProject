import { Component } from '@angular/core';
import { WebService } from '../web.service';

@Component({
  selector: '',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  teams_list: any = [];
  constructor(public webService: WebService) {}
}
