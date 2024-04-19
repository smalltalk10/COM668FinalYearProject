import { Component, ChangeDetectorRef } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-active-btn-cell-renderer',
  templateUrl: 'activeBtnCellRenderer.component.html',
})

export class ActiveBtnCellRendererComponent implements ICellRendererAngularComp {
  public params: any;
  public isActive: string = "false";

  constructor(private cd: ChangeDetectorRef) {}

  agInit(params: any): void {
    this.params = params;
    this.isActive = params.value;
  }

  setAsActive(): void {
    this.isActive = "true";
    this.cd.detectChanges();
    if (this.params.onClick) {
      this.params.onClick(this.params.data.id, true);
    }
  }

  setAsDeactive(): void {
    this.isActive = "false";
    this.cd.detectChanges();
    if (this.params.onClick) {
      this.params.onClick(this.params.data.id, false);
    }
  }

  refresh(params: any): boolean {
    return false;
  }
}