// Imported Modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { WebService } from './web.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgGridModule } from 'ag-grid-angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBadgeModule } from '@angular/material/badge';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgxGaugeModule } from 'ngx-gauge';
import { GoogleMapsModule } from '@angular/google-maps'

// My Componenets
import { NavComponent } from './nav/nav.component';
import { HomeComponent } from './home/home.component';
import { AuthenticationModalComponent } from './nav/loginModal/authentication.modal.component';
import { DashboardComponent } from './dashboard/dashboard.component';

var routes: any = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
];

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    AuthenticationModalComponent,
    DashboardComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    ReactiveFormsModule,
    NgbModule,
    AgGridModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatTabsModule,
    MatBadgeModule,
    MatPaginatorModule,
    MatExpansionModule,
    NgxGaugeModule,
    GoogleMapsModule
  ],
  providers: [WebService],
  bootstrap: [AppComponent],
})
export class AppModule {}
