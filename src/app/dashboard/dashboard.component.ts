import { Component } from '@angular/core';
import { WebService } from '../web.service';
import { Observable, interval } from 'rxjs';
import { switchMap, startWith } from 'rxjs/operators';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  current_measurements!: Observable<any>;

  constructor(public webService: WebService) {}

  ngOnInit() {
    this.current_measurements = interval(60000).pipe(
      startWith(0),
      switchMap(() => this.webService.getCurrentMeasurements())
    );
  }
}