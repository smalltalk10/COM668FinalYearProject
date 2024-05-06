import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { WebService } from '../../../web.service';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { FormBuilder, Validators } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';
import { ActiveBtnCellRendererComponent } from './cellRenderers/activeBtnCellRenderer.component';
import { Router } from '@angular/router';
import { DefaultThresholds, conditionsMapping } from '../../../models/constants/default-thresholds';

export interface Threshold {
  id: string;
  name: string;
  temperatureMin: number;
  temperatureMax: number;
  moistureMin: number;
  moistureMax: number;
  ecMin: number;
  ecMax: number;
  phMin: number;
  phMax: number;
  nitrogenMin: number;
  nitrogenMax: number;
  phosphorusMin: number;
  phosphorusMax: number;
  potassiumMin: number;
  potassiumMax: number;
  isActive?: string;
}

export interface ThresholdData {
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
    selectedParameters: [],
  };
  thresholdForm: any;
  decodedToken: any;
  thresholdParameters = DefaultThresholds.thresholds;
  conditionsMapping = conditionsMapping;

  gridApi!: GridApi;
  rowData: Threshold[] = [];
  gridOptions: any = {
    context: {
      componentParent: this
    }
  };
  
  colDefs: ColDef[] = [
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
    public webService: WebService,
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
    this.thresholdForm = this.formBuilder.group({
      name: ['', Validators.required],
    });
    this.fetchGrid();
    this.gridOptions.context.componentParent = this;
  }

  fetchGrid() {
    this.webService.getAllThresholds().subscribe({
      next: (response: any) => {
        const thresholdData = response as ThresholdData;
        this.rowData = thresholdData.value;
        this.selectedThreshold = {
          name: '',
          selectedConditions: [],
        };
        this.thresholdForm.reset();
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
      const updatedConditions = this.thresholdParameters.map((condition: any) => {
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
      this.thresholdForm.get('name').setValue(this.selectedThreshold.name);
    } else {
      this.selectedThreshold = {
        selectedParameters: [],
      };
      this.thresholdForm.get('name').setValue('');
    }
  }

  nameInvalid(): boolean {
    const control = this.thresholdForm.get('name');
    return (
      control.invalid && (control.dirty || this.thresholdForm.untouched)
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
    if (this.thresholdForm.valid) {
      this.webService
        .createThreshold(this.thresholdForm.value, this.thresholdParameters)
        .subscribe({
          next: () => {
            this.fetchGrid();
          },
          error: (error) => {
            console.error('HTTP error:', error);
          },
        });
    }
  }

  onSubmitUpdateThreshold() {
    this.webService
      .updateThreshold(
        this.selectedThreshold.id,
        this.thresholdForm.value,
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
