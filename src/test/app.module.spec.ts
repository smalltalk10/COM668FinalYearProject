import { TestBed } from '@angular/core/testing';
import { AppComponent } from 'src/app/app.component';
import { NavComponent } from 'src/app/component/nav/nav.component';
import { HomeComponent } from 'src/app/component/home/home.component';
import { DashboardComponent } from 'src/app/component/dashboard/dashboard.component';
import { DataComponent } from 'src/app/component/data/data.component';
import { ForecastComponent } from 'src/app/component/forecast/forecast.component';
import { ThresholdModalComponent } from 'src/app/component/nav/thresholdModal/threshold.modal.component';
import { ActiveBtnCellRendererComponent } from 'src/app/component/nav/thresholdModal/cellRenderers/activeBtnCellRenderer.component';
import { UserProfileModalComponent } from 'src/app/component/nav/userProfileModal/userProfile.modal.component';
import { DeviceModalComponent } from 'src/app/component/nav/deviceModal/device.modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgGridModule } from 'ag-grid-angular';
import { AgChartsAngular } from 'ag-charts-angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxGaugeModule } from 'ngx-gauge';
import { GoogleMapsModule } from '@angular/google-maps';
import { HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSliderModule } from '@angular/material/slider';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterModule } from '@angular/router';
import { ComponentFixture } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { WebService } from 'src/app/web.service';

describe('AppModule', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        HomeComponent,
        NavComponent,
        ThresholdModalComponent,
        DashboardComponent,
        DataComponent,
        ActiveBtnCellRendererComponent,
        ForecastComponent,
        UserProfileModalComponent,
        DeviceModalComponent,
      ],
      imports: [
        BrowserModule,
        HttpClientModule,
        RouterModule.forRoot([]), // Empty routes for testing
        ReactiveFormsModule,
        FormsModule,
        NgbModule,
        AgGridModule,
        AgChartsAngular,
        BrowserAnimationsModule,
        NgxGaugeModule,
        GoogleMapsModule,
        MatIconModule,
        MatButtonModule,
        MatMenuModule,
        MatInputModule,
        MatTabsModule,
        MatBadgeModule,
        MatSliderModule,
        MatExpansionModule,
      ],
      providers: [WebService], // Provide WebService here if necessary
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
