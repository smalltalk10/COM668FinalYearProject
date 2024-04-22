import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { DataComponent } from 'src/app/component/data/data.component';
import { WebService } from 'src/app/web.service';

describe('DataComponent', () => {
  let component: DataComponent;
  let fixture: ComponentFixture<DataComponent>;
  let webServiceMock: jest.Mocked<WebService>;
  let router: jest.Mocked<Router>;

  beforeEach(async () => {
    webServiceMock = {
      getAllDateRangeMeasurements: jest.fn().mockReturnValue(of([])),
      dayData: [],
      weekData: [],
      monthData: [],
    } as any;

    router = {
      navigateByUrl: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      declarations: [DataComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: WebService, useValue: webServiceMock },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DataComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect if no token is present', () => {
    sessionStorage.removeItem('token');
    component.ngOnInit();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/');
  });

  it('should not redirect and fetch data if token is present', () => {
    sessionStorage.setItem('token', 'valid-token');
    component.ngOnInit();
    expect(router.navigateByUrl).not.toHaveBeenCalled();
    expect(webServiceMock.getAllDateRangeMeasurements).toHaveBeenCalled();
  });

  it('should handle errors gracefully when fetching data', () => {
    const error = new Error('Error fetching data');
    webServiceMock.getAllDateRangeMeasurements.mockReturnValue(throwError(() => error));
    component.ngOnInit();
    expect(webServiceMock.getAllDateRangeMeasurements).toHaveBeenCalled();
  });

  it('should update data and charts based on selected range', () => {
    component.onTabChange(2);
    expect(component.dateRange).toEqual('month');
    expect(component.title).toEqual('Monthly');
  });

  it('should process and format grid data correctly', () => {
    const sampleData = [{ Body: { datetime: '2021-01-01', moisture: 10, temperature: 25, ec: 1, ph: 7, nitrogen: 3, phosphorus: 4, potassium: 5 } }];
    const gridData = component.processDataForGrid(sampleData);
    expect(gridData.length).toBeGreaterThan(0);
    expect(gridData[0]).toHaveProperty('average');
    expect(gridData[0]).toHaveProperty('median');
  });

  it('should calculate statistics correctly', () => {
    const values = [10, 20, 30, 40, 50];
    const stats = component.calculateStatistics(values);
    expect(stats.average).toEqual('30.00');
    expect(stats.median).toEqual('30.00');
    expect(stats.minValue).toEqual('10.00');
    expect(stats.maxValue).toEqual('50.00');
  });
});