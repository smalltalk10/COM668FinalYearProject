import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { WebService } from 'src/app/web.service';
import { of } from 'rxjs';

describe('WebService', () => {
  let service: WebService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WebService],
    });
    service = TestBed.inject(WebService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create a user', () => {
    const registerForm = {
      username: 'testUser',
      email: 'test@example.com',
      password: '12345',
      deviceID: 'device123',
    };
    service.createUser(registerForm).subscribe((response) => {
      expect(response).toEqual({ success: true });
    });

    const req = httpMock.expectOne((r) => r.url.includes('user'));
    expect(req.request.method).toBe('POST');
    req.flush({ success: true });
  });

  it('should log in a user', () => {
    const loginDetails = { username: 'user', password: 'pass' };
    service.login(loginDetails).subscribe((response) => {
      expect(response).toEqual({ token: '123456' });
    });

    const req = httpMock.expectOne((r) => r.url.includes('login'));
    expect(req.request.method).toBe('GET');
    req.flush({ token: '123456' });
  });

  it('should get current measurements', () => {
    service.getCurrentMeasurements().subscribe((response) => {
      expect(response).toEqual({ data: 'measurements' });
    });

    const req = httpMock.expectOne((r) => r.url.includes('measurement'));
    expect(req.request.method).toBe('GET');
    req.flush({ data: 'measurements' });
  });

  it('should get location', () => {
    const id = '1234'
    service.getLocation(id).subscribe((response) => {
      expect(response).toEqual({ location: 'location data' });
    });

    const req = httpMock.expectOne((r) => r.url.includes('location'));
    expect(req.request.method).toBe('GET');
    req.flush({ location: 'location data' });
  });

  it('should edit a user', () => {
    const editDetails = { email: 'new@example.com', password: 'new12345' };
    service.updateUser('1', editDetails).subscribe((response) => {
      expect(response).toEqual({ success: true });
    });

    const req = httpMock.expectOne((r) => r.url.includes('user/1'));
    expect(req.request.method).toBe('PUT');
    req.flush({ success: true });
  });

  it('should delete a user', () => {
    service.deleteUser('1').subscribe((response) => {
      expect(response).toEqual({ success: true });
    });

    const req = httpMock.expectOne((r) => r.url.includes('user/1'));
    expect(req.request.method).toBe('DELETE');
    req.flush({ success: true });
  });

  it('should get current weather', () => {
    service.getCurrentWeather(0, 0).subscribe((response) => {
      expect(response).toBeTruthy();
    });

    const weatherReq = httpMock.expectOne((r) =>
      r.url.includes('current.json')
    );
    const astroReq = httpMock.expectOne((r) =>
      r.url.includes('astronomy.json')
    );

    expect(weatherReq.request.method).toBe('GET');
    expect(astroReq.request.method).toBe('GET');

    weatherReq.flush({ weather: 'sunny' });
    astroReq.flush({ astro: 'stars' });
  });

  it('should get forecasted weather', () => {
    service.getForecastedWeather(0, 0).subscribe((response) => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne((r) => r.url.includes('forecast.json'));
    expect(req.request.method).toBe('GET');
    req.flush({ forecast: 'rainy' });
  });

  it('should get all date range measurements and update data properties', () => {
    const dayData = { data: 'day data' };
    const weekData = { data: 'week data' };
    const monthData = { data: 'month data' };

    // Mock the getDateRangeMeasurements method
    const getDateRangeMeasurementsSpy = jest
      .spyOn(service, 'getDateRangeMeasurements')
      .mockImplementation((range) => {
        switch (range) {
          case 'day':
            return of(dayData);
          case 'week':
            return of(weekData);
          case 'month':
            return of(monthData);
          default:
            throw new Error('Invalid range');
        }
      });

    // Execute the function
    service.getAllDateRangeMeasurements().subscribe();

    // Verify the mock calls
    expect(getDateRangeMeasurementsSpy).toHaveBeenCalledTimes(3);
    expect(getDateRangeMeasurementsSpy).toHaveBeenCalledWith('day');
    expect(getDateRangeMeasurementsSpy).toHaveBeenCalledWith('week');
    expect(getDateRangeMeasurementsSpy).toHaveBeenCalledWith('month');

    // Verify internal state changes
    expect(service.dayData).toEqual(dayData);
    expect(service.weekData).toEqual(weekData);
    expect(service.monthData).toEqual(monthData);
  });


  it('should update location', () => {
    const id = '1234'
    const markerPosition = { lat: 10, lng: 20 };
    service.updateLocation(id, markerPosition).subscribe((response) => {
      expect(response).toEqual({ success: true });
    });

    const req = httpMock.expectOne((r) => r.url.includes('location'));
    expect(req.request.method).toBe('PUT');
    expect(req.request.body.get('lat')).toBe(String(markerPosition.lat));
    expect(req.request.body.get('lng')).toBe(String(markerPosition.lng));
    req.flush({ success: true });
  });

  it('should get all thresholds', () => {
    service.getAllThresholds().subscribe((response) => {
      expect(response).toEqual({ thresholds: [] });
    });

    const req = httpMock.expectOne((r) => r.url.includes('thresholds'));
    expect(req.request.method).toBe('GET');
    req.flush({ thresholds: [] });
  });

  it('should create a threshold', () => {
    const thresholdForm = {
      name: 'New Threshold',
    };

    const conditions = [
      { currentLowValue: 0, currentHighValue: 100 },
      { currentLowValue: 10, currentHighValue: 20 },
      { currentLowValue: 1, currentHighValue: 3 },
      { currentLowValue: 6, currentHighValue: 8 },
      { currentLowValue: 5, currentHighValue: 15 },
      { currentLowValue: 2, currentHighValue: 10 },
      { currentLowValue: 3, currentHighValue: 12 },
    ];

    service.createThreshold(thresholdForm, conditions).subscribe((response) => {
      expect(response).toEqual({ success: true });
    });

    const req = httpMock.expectOne((r) => r.url.includes('threshold'));
    expect(req.request.method).toBe('POST');
    req.flush({ success: true });
  });

  it('should update a threshold', () => {
    const thresholdForm = {
      name: 'Updated Threshold',
    };

    const conditions = [
      { currentLowValue: 1, currentHighValue: 101 },
      { currentLowValue: 11, currentHighValue: 21 },
      { currentLowValue: 2, currentHighValue: 4 },
      { currentLowValue: 7, currentHighValue: 9 },
      { currentLowValue: 6, currentHighValue: 16 },
      { currentLowValue: 3, currentHighValue: 11 },
      { currentLowValue: 4, currentHighValue: 13 },
    ];

    service
      .updateThreshold('1', thresholdForm, conditions)
      .subscribe((response) => {
        expect(response).toEqual({ success: true });
      });

    const req = httpMock.expectOne((r) => r.url.includes('threshold/1'));
    expect(req.request.method).toBe('PUT');
    req.flush({ success: true });
  });
  
  it('should activate a threshold', () => {
    const isActive = true;
    service.activateThreshold('1', isActive).subscribe((response) => {
      expect(response).toEqual({ success: true });
    });

    const req = httpMock.expectOne((r) =>
      r.url.includes('threshold/1/activate')
    );
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body.get('isActive')).toBe(isActive.toString());
    req.flush({ success: true });
  });

  it('should delete a threshold', () => {
    service.deleteThreshold('1').subscribe((response) => {
      expect(response).toEqual({ success: true });
    });

    const req = httpMock.expectOne((r) => r.url.includes('threshold/1'));
    expect(req.request.method).toBe('DELETE');
    req.flush({ success: true });
  });

  
  it('should edit a user', () => {
    const editDetails = { email: 'new@example.com', password: 'new12345' };
    service.updateUser('1', editDetails).subscribe((response) => {
      expect(response).toEqual({ success: true });
    });

    const req = httpMock.expectOne((r) => r.url.includes('user/1'));
    expect(req.request.method).toBe('PUT');
    req.flush({ success: true });
  });

  it('should delete a user', () => {
    service.deleteUser('1').subscribe((response) => {
      expect(response).toEqual({ success: true });
    });

    const req = httpMock.expectOne((r) => r.url.includes('user/1'));
    expect(req.request.method).toBe('DELETE');
    req.flush({ success: true });
  });
});
