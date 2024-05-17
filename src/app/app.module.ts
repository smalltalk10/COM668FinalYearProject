// Defaulted Modules
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Imported Modules
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSliderModule } from '@angular/material/slider';
import { MatExpansionModule } from '@angular/material/expansion';
import { GoogleMapsModule } from '@angular/google-maps'
import { NgxGaugeModule } from 'ngx-gauge';
import { AgGridModule } from 'ag-grid-angular';
import { AgChartsAngular } from 'ag-charts-angular';

// My Components
import { WebService } from './web.service';
import { NavComponent } from './component/nav/nav.component';
import { HomeComponent } from './component/home/home.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { DataComponent } from './component/data/data.component'
import { ForecastComponent } from './component/forecast/forecast.component'
import { ThresholdModalComponent } from './component/nav/thresholdModal/threshold.modal.component';
import { ActiveBtnCellRendererComponent } from './component/nav/thresholdModal/cellRenderers/activeBtnCellRenderer.component';
import { UserProfileModalComponent } from './component/nav/userProfileModal/userProfile.modal.component';
import { DeviceModalComponent } from './component/nav/deviceModal/device.modal.component'; 


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
  {
    path: 'forecast',
    component: ForecastComponent,
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
    ActiveBtnCellRendererComponent,
    ForecastComponent,
    UserProfileModalComponent,
    DeviceModalComponent
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
