import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { NgbModal, NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { of, throwError } from 'rxjs';

import { ThresholdModalComponent } from 'src/app/component/nav/thresholdModal/threshold.modal.component';
import { WebService } from 'src/app/web.service';
import { ActiveBtnCellRendererComponent } from 'src/app/component/nav/thresholdModal/cellRenderers/activeBtnCellRenderer.component';

describe('ThresholdModalComponent', () => {
  let component: ThresholdModalComponent;
  let fixture: ComponentFixture<ThresholdModalComponent>;
  let webServiceMock: jest.Mocked<WebService>;
  let modalServiceMock: jest.Mocked<NgbModal>;
  let gridApiMock: jest.Mocked<GridApi>;

  beforeEach(async () => {
    webServiceMock = {
      getAllThresholds: jest.fn().mockReturnValue(of({ value: [] })),
      createThreshold: jest.fn().mockReturnValue(of({})),
      updateThreshold: jest.fn().mockReturnValue(of({})),
      deleteThreshold: jest.fn().mockReturnValue(of({})),
      activateThreshold: jest.fn().mockReturnValue(of({})),
      getHeaders: jest.fn(),
      editUser: jest.fn(),
      deleteUser: jest.fn(),
      getCurrentMeasurements: jest.fn(),
      dayData: [],
      weekData: [],
      monthData: [],
      login: jest.fn(),
      logout: jest.fn(),
    } as any;

    modalServiceMock = {
      open: jest.fn(),
    } as any;

    gridApiMock = {
      getSelectedRows: jest.fn(),
      setGridOption: jest.fn(),
    } as any;

    TestBed.configureTestingModule({
      declarations: [ThresholdModalComponent, ActiveBtnCellRendererComponent],
      imports: [
        RouterTestingModule,
        HttpClientModule,
        ReactiveFormsModule,
        FormsModule,
        NgbModule,
      ],
      providers: [
        { provide: WebService, useValue: webServiceMock },
        { provide: NgbModal, useValue: modalServiceMock },
        { provide: NgbActiveModal, useValue: {} },
        { provide: GridApi, useValue: gridApiMock },
        FormBuilder,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ThresholdModalComponent);
    component = fixture.componentInstance;
    component.webService = webServiceMock;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch thresholds on init', () => {
    expect(webServiceMock.getAllThresholds).toHaveBeenCalled();
  });

  it('should handle form submission and API call', () => {
    component.newThresholdForm.controls['name'].setValue('New Threshold');
    component.onSubmitCreateThreshold();
    expect(webServiceMock.createThreshold).toHaveBeenCalled();
  });

  it('should update threshold on form submit', () => {
    component.selectedThreshold.id = '123';
    component.newThresholdForm.controls['name'].setValue('Updated Threshold');
    component.onSubmitUpdateThreshold();
    expect(webServiceMock.updateThreshold).toHaveBeenCalledWith(
      '123',
      { name: 'Updated Threshold' },
      expect.anything()
    );
  });

  it('should delete threshold on request', () => {
    component.selectedThreshold.id = '123';
    component.onSubmitDeleteThreshold();
    expect(webServiceMock.deleteThreshold).toHaveBeenCalledWith('123');
  });

  it('should handle active toggle', () => {
    const id = '123';
    const isActive = true;
    component.handleActiveToggle(id, isActive);
    expect(webServiceMock.activateThreshold).toHaveBeenCalledWith(id, isActive);
  });

  it('should manage grid ready event', () => {
    const gridReadyEvent = {
      api: gridApiMock,
      columnApi: {} as any,
      context: {},
      type: 'gridReady'
    } as GridReadyEvent;
    component.onGridReady(gridReadyEvent);
    expect(component.gridApi).toBe(gridApiMock);
  });

  it('should update selectedThreshold when a row is selected', () => {
    const gridReadyEvent = {
      api: gridApiMock,
      columnApi: {} as any,
      context: {},
      type: 'gridReady'
    } as GridReadyEvent;
    component.onGridReady(gridReadyEvent);

    const selectedRows = [{ id: '1', name: 'Threshold 1', temperatureMin: '10', temperatureMax: '20' }];
    gridApiMock.getSelectedRows.mockReturnValue(selectedRows);

    component.onSelectionChanged({});

    expect(component.selectedThreshold).toEqual({
      name: 'Threshold 1',
      id: '1',
      selectedConditions: [
        { name: 'Temperature (°C)', minValue: -20, maxValue: 60, currentLowValue: 10, currentHighValue: 20 },
        { name: 'Moisture (%)', minValue: 0, maxValue: 100, currentLowValue: NaN, currentHighValue: NaN },
        { name: 'Salinity (µS/cm)', minValue: 0, maxValue: 1200, currentLowValue: NaN, currentHighValue: NaN },
        { name: 'pH', minValue: 0, maxValue: 14, currentLowValue: NaN, currentHighValue: NaN },
        { name: 'Nitrogen (mg/kg)', minValue: 0, maxValue: 200, currentLowValue: NaN, currentHighValue: NaN },
        { name: 'Phosphorus (mg/kg)', minValue: 0, maxValue: 250, currentLowValue: NaN, currentHighValue: NaN },
        { name: 'Potassium (mg/kg)', minValue: 0, maxValue: 500, currentLowValue: NaN, currentHighValue: NaN },
      ],
    });
  });

  it('should not submit create threshold with invalid form input', () => {
    component.newThresholdForm.controls['name'].setValue('');
  
    const createThresholdSpy = jest.spyOn(component.webService, 'createThreshold');
  
    component.onSubmitCreateThreshold();
  
    expect(createThresholdSpy).not.toHaveBeenCalled();
  });

  it('should set grid options with empty rowData on grid ready event', () => {
    const gridReadyEvent = {
      api: gridApiMock,
      columnApi: {} as any,
      context: {},
      type: 'gridReady'
    } as GridReadyEvent;

    component.onGridReady(gridReadyEvent);

    expect(gridApiMock.setGridOption).toHaveBeenCalledWith('rowData', []);
  });


  it('should set the form name when a threshold is selected', () => {
    const gridReadyEvent = {
      api: gridApiMock,
      columnApi: {} as any,
      context: {},
      type: 'gridReady',
    } as GridReadyEvent;
    component.onGridReady(gridReadyEvent);

    const selectedRows = [{ id: '1', name: 'Threshold 1' }];
    gridApiMock.getSelectedRows.mockReturnValue(selectedRows);

    component.onSelectionChanged({});

    expect(component.newThresholdForm.controls['name'].value).toBe('Threshold 1');
  });

  it('should mark the form as invalid when name is empty', () => {
    component.newThresholdForm.controls['name'].setValue('');
    expect(component.nameInvalid()).toBe(true);
  });

  it('should mark the form as valid when name is not empty', () => {
    component.newThresholdForm.controls['name'].setValue('Valid Name');
    expect(component.nameInvalid()).toBe(false);
  });

  it('should format large values with "k" suffix', () => {
    expect(component.formatLabel(1234)).toBe('1k');
    expect(component.formatLabel(123)).toBe('123');
  });

  it('should handle slider change', () => {
    const condition = { currentValue: 0 };
    const event = { value: 10 };
    component.handleSliderChange(event, condition);
    expect(condition.currentValue).toBe(10);
  });

  it('should set quickFilterText option when filter text box changes', () => {
    const mockInputElement = document.createElement('input');
    mockInputElement.id = 'filter-text-box';
    const inputValue = 'test filter';
    mockInputElement.value = inputValue;

    jest.spyOn(document, 'getElementById').mockReturnValue(mockInputElement);

    component.gridApi = gridApiMock;

    component.onFilterTextBoxChanged();

    expect(gridApiMock.setGridOption).toHaveBeenCalledWith(
      'quickFilterText',
      inputValue
    );
  });

  it('should handle fetchGrid error', () => {
    webServiceMock.getAllThresholds.mockReturnValue(throwError('API error'));
  
    component.fetchGrid();
  
    expect(webServiceMock.getAllThresholds).toHaveBeenCalled();
  });

  it('should handle form submission error', () => {
    component.newThresholdForm.controls['name'].setValue('New Threshold');
  
    webServiceMock.createThreshold.mockReturnValue(throwError('API error'));
  
    component.onSubmitCreateThreshold();

    expect(webServiceMock.createThreshold).toHaveBeenCalled();
  });
  
  it('should handle update threshold error', () => {
    component.selectedThreshold.id = '123';
    component.newThresholdForm.controls['name'].setValue('Updated Threshold');
  
    webServiceMock.updateThreshold.mockReturnValue(throwError('API error'));
  
    component.onSubmitUpdateThreshold();
  
    expect(webServiceMock.updateThreshold).toHaveBeenCalledWith(
      '123',
      { name: 'Updated Threshold' },
      expect.anything()
    );
  });

  it('should handle active toggle error', () => {
    const id = '123';
    const isActive = true;
  
    webServiceMock.activateThreshold.mockReturnValue(throwError('API error'));

    component.handleActiveToggle(id, isActive);
  
    expect(webServiceMock.activateThreshold).toHaveBeenCalledWith(id, isActive);
  });
  
  it('should handle delete threshold error', () => {
    component.selectedThreshold.id = '123';

    webServiceMock.deleteThreshold.mockReturnValue(throwError('API error'));
  
    component.onSubmitDeleteThreshold();
  
    expect(webServiceMock.deleteThreshold).toHaveBeenCalledWith('123');
  });
  
});