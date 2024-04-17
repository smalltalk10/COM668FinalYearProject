// Imported Modules
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { WebService } from './web.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgGridModule } from 'ag-grid-angular';
import { AgChartsAngular } from 'ag-charts-angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxGaugeModule } from 'ngx-gauge';
import { GoogleMapsModule } from '@angular/google-maps'

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSliderModule } from '@angular/material/slider';
import { MatExpansionModule } from '@angular/material/expansion';

// My Componenets
import { NavComponent } from './nav/nav.component';
import { HomeComponent } from './home/home.component';
import { ThresholdModalComponent } from './nav/thresholdModal/threshold.modal.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DataComponent } from './data/data.component'
import { ActiveBtnCellRendererComponent } from './nav/thresholdModal/cellRenderers/activeBtnCellRenderer.component';

var routes: any = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'data',
    component: DataComponent,
  },
];

@NgModule({
  declarations: [
    HomeComponent,
    AppComponent,
    NavComponent,
    ThresholdModalComponent,
    DashboardComponent,
    DataComponent,
    ActiveBtnCellRendererComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    ReactiveFormsModule,
    NgbModule,
    AgGridModule,
    AgChartsAngular,
    BrowserAnimationsModule,
    NgxGaugeModule,
    GoogleMapsModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatInputModule,
    MatTabsModule,
    MatBadgeModule,
    MatSliderModule,
    MatExpansionModule
  ],
  providers: [WebService],
  bootstrap: [AppComponent],
})
export class AppModule {}
