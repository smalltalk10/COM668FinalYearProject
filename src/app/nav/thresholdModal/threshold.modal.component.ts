import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { WebService } from '../../web.service';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { FormBuilder, Validators } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';
import { ActiveBtnCellRendererComponent } from './cellRenderers/activeBtnCellRenderer.component';
import { Router } from '@angular/router';

export interface Threshold {
  id: string;
  name: string;
  temperatureMin: string;
  temperatureMax: string;
  moistureMin: string;
  moistureMax: string;
  ecMin: string;
  ecMax: string;
  phMin: string;
  phMax: string;
  nitrogenMin: string;
  nitrogenMax: string;
  phosphorusMin: string;
  phosphorusMax: string;
  potassiumMin: string;
  potassiumMax: string;
  isActive?: string;
}

export interface ApiResponse {
  value: Threshold[];
}

@Component({
  selector: 'app-threshold-modal',
  templateUrl: './threshold.modal.component.html',
  styleUrls: ['./threshold.modal.component.css'],
})
export class ThresholdModalComponent implements OnInit {
  selectedThreshold: any = {
    name: '',
    selectedCondtions: [],
  };
  newThresholdForm: any;
  deviceID = sessionStorage.getItem('deviceID');
  decodedToken: any;

  private gridApi!: GridApi;
  public rowData: Threshold[] = [];
  public gridOptions: any = {
    context: {
      componentParent: this
    }
  };

  conditions = [
    {
      name: 'Temperature (°C)',
      minValue: -20,
      maxValue: 60,
      currentLowValue: -20,
      currentHighValue: 60,
    },
    {
      name: 'Moisture (%)',
      minValue: 0,
      maxValue: 100,
      currentLowValue: 0,
      currentHighValue: 100,
    },
    {
      name: 'Salinity (µS/cm)',
      minValue: 0,
      maxValue: 1200,
      currentLowValue: 0,
      currentHighValue: 1200,
    },
    {
      name: 'pH',
      minValue: 0,
      maxValue: 14,
      currentLowValue: 0,
      currentHighValue: 14,
    },
    {
      name: 'Nitrogen (mg/kg)',
      minValue: 0,
      maxValue: 200,
      currentLowValue: 0,
      currentHighValue: 200,
    },
    {
      name: 'Phosphorus (mg/kg)',
      minValue: 0,
      maxValue: 250,
      currentLowValue: 0,
      currentHighValue: 250,
    },
    {
      name: 'Potassium (mg/kg)',
      minValue: 0,
      maxValue: 500,
      currentLowValue: 0,
      currentHighValue: 500,
    },
  ];

  conditionsMapping = [
    {
      name: 'Temperature (°C)',
      minKey: 'temperatureMin',
      maxKey: 'temperatureMax',
    },
    { name: 'Moisture (%)', minKey: 'moistureMin', maxKey: 'moistureMax' },
    { name: 'Salinity (µS/cm)', minKey: 'ecMin', maxKey: 'ecMax' },
    { name: 'pH', minKey: 'phMin', maxKey: 'phMax' },
    { name: 'Nitrogen (mg/kg)', minKey: 'nitrogenMin', maxKey: 'nitrogenMax' },
    {
      name: 'Phosphorus (mg/kg)',
      minKey: 'phosphorusMin',
      maxKey: 'phosphorusMax',
    },
    {
      name: 'Potassium (mg/kg)',
      minKey: 'potassiumMin',
      maxKey: 'potassiumMax',
    },
  ];

  public colDefs: ColDef[] = [
    { field: 'name', headerName: 'Alert Name' },
    { field: 'temperatureMin', headerName: 'Temp Min' },
    { field: 'temperatureMax', headerName: 'Temp Max' },
    { field: 'moistureMin', headerName: 'Mois Min' },
    { field: 'moistureMax', headerName: 'Mois Max' },
    { field: 'ecMin', headerName: 'EC Min' },
    { field: 'ecMax', headerName: 'EC Max' },
    { field: 'phMin', headerName: 'pH Min' },
    { field: 'phMax', headerName: 'pH Max' },
    { field: 'nitrogenMin', headerName: 'N Min' },
    { field: 'nitrogenMax', headerName: 'N Max' },
    { field: 'phosphorusMin', headerName: 'P Min' },
    { field: 'phosphorusMax', headerName: 'P Max' },
    { field: 'potassiumMin', headerName: 'K Min' },
    { field: 'potassiumMax', headerName: 'K Max' },
    {
      field: 'isActive',
      headerName: 'Active Status',
      cellClass: 'no-pointer',
      cellRenderer: ActiveBtnCellRendererComponent,
      width: 250,
      cellRendererParams: {
        onClick: (id: string, isActive: boolean) => this.handleActiveToggle(id, isActive)
      },
    }
  ];

  autoSizeStrategy: any = {
    type: 'fitGridWidth',
  };

  constructor(
    public activeModal: NgbActiveModal,
    private webService: WebService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = sessionStorage.getItem('token');
    if (token) {
      this.decodedToken = jwtDecode(token);
    } else {
      this.router.navigateByUrl('/');
    }
    this.newThresholdForm = this.formBuilder.group({
      name: ['', Validators.required],
    });
    this.fetchGrid();
    this.gridOptions.context.componentParent = this;
  }

  fetchGrid() {
    this.webService.getAllThresholds().subscribe({
      next: (response: any) => {
        const apiResponse = response as ApiResponse;
        this.rowData = apiResponse.value;
        this.selectedThreshold = {
          name: '',
          selectedConditions: [],
        };
        this.newThresholdForm.reset();
      },
      error: (error) => {
        console.error('Error fetching data:', error);
      },
    });
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.setGridOption('rowData', this.rowData);
  }

  public rowSelection: any = 'single';
  onSelectionChanged(event: any) {
    var selectedRow = this.gridApi.getSelectedRows()[0];

    if (selectedRow !== undefined) {
      const updatedConditions = this.conditions.map((condition: any) => {
        const mapping: any = this.conditionsMapping.find(
          (m) => m.name === condition.name
        );
        return {
          ...condition,
          currentLowValue: parseInt(selectedRow[mapping.minKey], 10),
          currentHighValue: parseInt(selectedRow[mapping.maxKey], 10),
        };
      });
      this.selectedThreshold.name = selectedRow.name;
      this.selectedThreshold.id = selectedRow.id;
      this.selectedThreshold.selectedConditions = updatedConditions;
      this.newThresholdForm.get('name').setValue(this.selectedThreshold.name);
    } else {
      this.selectedThreshold = {
        name: '',
        id: '',
        selectedConditions: [],
      };
      this.newThresholdForm.reset();
    }
  }

  nameInvalid(): boolean {
    const control = this.newThresholdForm.get('name');
    return (
      control.invalid && (control.dirty || this.newThresholdForm.untouched)
    );
  }

  onFilterTextBoxChanged() {
    this.gridApi.setGridOption(
      'quickFilterText',
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  formatLabel(value: number): string {
    if (value >= 1000) {
      return `${Math.round(value / 1000)}k`;
    }
    return value.toString();
  }

  handleSliderChange(event: any, condition: any): void {
    condition.currentValue = event.value;
  }

  onSubmitCreateThreshold() {
    this.webService
      .createThreshold(this.newThresholdForm.value, this.conditions)
      .subscribe({
        next: () => {
          this.fetchGrid();
        },
        error: (error) => {
          console.error('HTTP error:', error);
        },
      });
  }

  onSubmitUpdateThreshold() {
    this.webService
      .updateThreshold(
        this.selectedThreshold.id,
        this.newThresholdForm.value,
        this.selectedThreshold.selectedConditions
      )
      .subscribe({
        next: () => {
          this.fetchGrid();
        },
        error: (error) => {
          console.error('HTTP error:', error);
        },
      });
  }

  handleActiveToggle(id: string, isActive: boolean) {
    this.webService.activateThreshold(id, isActive).subscribe({
      next: () => {
        this.fetchGrid();
      },
      error: (error) => console.error('Failed to toggle active state:', error),
    });
  }

  onSubmitDeleteThreshold() {
    this.webService.deleteThreshold(this.selectedThreshold.id).subscribe({
      next: () => {
        this.fetchGrid();
      },
      error: (error) => {
        console.error('HTTP error:', error);
      },
    });
  }
}
