import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError, Observable } from 'rxjs';
import { DashboardComponent } from 'src/app/component/dashboard/dashboard.component';
import { WebService } from 'src/app/web.service';
import { Router } from '@angular/router';


interface WebServiceMock {
  getCurrentMeasurements: jest.Mock<Observable<any>>;
  getLocation: jest.Mock<Observable<any>>;
  getCurrentWeather: jest.Mock<Observable<any>>;
  updateLocation: jest.Mock<Observable<any>>;
  getAllDateRangeMeasurements: jest.Mock<Observable<any>>;
}

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let webServiceMock: WebServiceMock;
  let router: jest.Mocked<Router>;

  beforeEach(async () => {
    webServiceMock = {
      getCurrentMeasurements: jest.fn().mockReturnValue(of({})),
      getLocation: jest.fn().mockReturnValue(of({ lat: 1, lng: 2 })),
      getCurrentWeather: jest.fn().mockReturnValue(of({ currentWeather: {}, astroData: { astronomy: {} } })),
      updateLocation: jest.fn().mockReturnValue(of({})),
      getAllDateRangeMeasurements: jest.fn().mockReturnValue(of({})),
    };
    jest.spyOn(console, 'error').mockImplementation(() => {});

    await TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: WebService, useValue: webServiceMock },
        { provide: Router, useValue: { navigateByUrl: jest.fn() } }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router) as jest.Mocked<Router>;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect if no token is present', () => {
    sessionStorage.removeItem('token');
    component.ngOnInit();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/');
  });

  it('should handle error on load location', () => {
    const errorResponse = new Error('Failed to fetch location');
    webServiceMock.getLocation.mockReturnValue(throwError(() => errorResponse));
    component.loadLocation();
    expect(console.error).toHaveBeenCalledWith('Received invalid coordinates:', errorResponse);
  });

  it('should handle error on load current weather', () => {
    const errorResponse = new Error('Invalid weather data');
    webServiceMock.getCurrentWeather.mockReturnValue(throwError(() => errorResponse));
    component.loadCurrentWeather(1, 2);
    expect(console.error).toHaveBeenCalledWith('Received invalid weather response:', errorResponse);
  });

  it('should verify if positions are the same', () => {
    component.mapCoordinates = { lat: 1, lng: 2 };
    component.markerPosition = { lat: 1, lng: 2 };
    expect(component.positionsAreDifferent()).toBeFalsy();
  });
  
  it('should load location', () => {
    component.loadLocation();
    expect(webServiceMock.getLocation).toHaveBeenCalled();
  });

  it('should handle location response', () => {
    const response = { lat: 1, lng: 2 };
    component.handleLocationResponse(response);
    expect(component.mapCoordinates).toEqual({ lat: 1, lng: 2 });
  });

  it('should update map location', () => {
    component.updateMapLocation(1, 2);
    expect(component.mapCenter).toEqual({ lat: 1, lng: 2 });
    expect(component.markerPosition).toEqual({ lat: 1, lng: 2 });
    expect(component.isLocationLoaded).toBeTruthy();
  });

  it('should update current position', () => {
    component.updateCurrentPosition();

    expect(component.currentPosition).toBeDefined();
  });

  it('should load current weather', () => {
    component.loadCurrentWeather(1, 2);
    expect(webServiceMock.getCurrentWeather).toHaveBeenCalledWith(1, 2);
  });

  it('should handle map click', () => {
    const event: any = {
      latLng: {
        lat: () => 1,
        lng: () => 2,
      },
    };
    component.onMapClick(event);
    expect(component.mapCenter).toEqual({ lat: 1, lng: 2 });
    expect(component.markerPosition).toEqual({ lat: 1, lng: 2 });
  });

  it('should check if positions are different', () => {
    component.mapCoordinates = { lat: 1, lng: 2 };
    component.markerPosition = { lat: 2, lng: 3 };
    expect(component.positionsAreDifferent()).toBeTruthy();
  });

  it('should submit update location', () => {
    component.onSubmitUpdateLocation();
    expect(webServiceMock.updateLocation).toHaveBeenCalled();
  });
});
