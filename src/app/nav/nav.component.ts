import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { WebService } from '../web.service';

@Component({
  selector: 'navigation',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})

export class NavComponent {
  constructor(
    public webService: WebService,
    public router: Router,
  ) {}

  sessionStorage: Storage = window.sessionStorage;
}
