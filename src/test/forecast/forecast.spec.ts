import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { ForecastComponent } from 'src/app/component/forecast/forecast.component';
import { WebService } from 'src/app/web.service';
import { Router } from '@angular/router';

describe('ForecastComponent', () => {
  let component: ForecastComponent;
  let fixture: ComponentFixture<ForecastComponent>;
  let webServiceMock: jest.Mocked<WebService>;
  let router: jest.Mocked<Router>;
  let consoleSpy: jest.SpyInstance;

  beforeEach(async () => {
    webServiceMock = {
      getForecastedWeather: jest.fn().mockReturnValue(
        of({
          location: { name: 'Los Angeles', country: 'USA' },
          forecast: { forecastday: [] },
        })
      ),
      dayData: [],
      weekData: [],
      monthData: [],
      createUser: jest.fn(),
      login: jest.fn(),
      logout: jest.fn(),
      getAllDateRangeMeasurements: jest.fn(),
      deleteThreshold: jest.fn(),
    } as any;

    router = {
      navigateByUrl: jest.fn(),
    } as any;

    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    await TestBed.configureTestingModule({
      declarations: [ForecastComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: WebService, useValue: webServiceMock },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ForecastComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
    consoleSpy.mockRestore();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect to login if no token is present', () => {
    sessionStorage.removeItem('token');
    component.ngOnInit();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/');
  });

  it('should load forecasted weather if token is present', () => {
    sessionStorage.setItem('token', 'some-token');
    sessionStorage.setItem('lat', '34.0522');
    sessionStorage.setItem('lng', '-118.2437');
    component.ngOnInit();
    expect(webServiceMock.getForecastedWeather).toHaveBeenCalledWith(34.0522, -118.2437);
  });

  it('should handle errors when fetching weather data', () => {
    sessionStorage.setItem('token', 'some-token');
    sessionStorage.setItem('lat', '34.0522');
    sessionStorage.setItem('lng', '-118.2437');
    const error = new Error('Failed to fetch weather data');
    webServiceMock.getForecastedWeather.mockReturnValue(throwError(() => error));
    component.ngOnInit();
    expect(console.error).toHaveBeenCalledWith('Received invalid weather response:', error);
  });

  it('should handle errors when fetching weather data', () => {
    sessionStorage.setItem('token', 'some-token');
    sessionStorage.setItem('lat', '34.0522');
    sessionStorage.setItem('lng', '-118.2437');
    webServiceMock.getForecastedWeather.mockReturnValue(
      throwError(() => new Error('Failed to fetch weather data'))
    );
    component.ngOnInit();
    expect(console.error).toHaveBeenCalledWith(
      'Received invalid weather response:',
      expect.any(Error)
    );
  });

  it('should setup temperature chart correctly', () => {
    sessionStorage.setItem('token', 'some-token');
    webServiceMock.getForecastedWeather.mockReturnValue(
      of({
        location: { name: 'Los Angeles', country: 'USA' },
        forecast: {
          forecastday: [
            {
              date: '2021-01-01',
              day: { avgtemp_c: 22, maxtemp_c: 25, mintemp_c: 18 },
            },
            {
              date: '2021-01-02',
              day: { avgtemp_c: 23, maxtemp_c: 26, mintemp_c: 19 },
            },
          ],
        },
      })
    );
    component.loadForecastedWeather();
    expect(component.temperatureChartOptions?.data?.length).toEqual(2);
  });

  it('should setup precipitation chart correctly', () => {
    sessionStorage.setItem('token', 'some-token');
    webServiceMock.getForecastedWeather.mockReturnValue(
      of({
        location: { name: 'Los Angeles', country: 'USA' },
        forecast: {
          forecastday: [
            {
              date: '2021-01-01',
              day: { daily_chance_of_rain: 20, totalprecip_mm: 5 },
            },
            {
              date: '2021-01-02',
              day: { daily_chance_of_rain: 25, totalprecip_mm: 10 },
            },
          ],
        },
      })
    );
    component.loadForecastedWeather();
    expect(component.precipitationChartOptions?.data?.length).toEqual(2);
  });
});
