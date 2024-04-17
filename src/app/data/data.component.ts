import { Component, OnInit } from '@angular/core';
import { WebService } from '../web.service';
import { AgChartOptions, time } from 'ag-charts-community';
import { ColDef } from 'ag-grid-community';

interface SensorData {
  Body: {
    datetime: string;
    moisture: number;
    temperature: number;
    ec: number;
    ph: number;
    nitrogen: number;
    phosphorus: number;
    potassium: number;
  };
}

interface Statistics {
  moisture: number[];
  temperature: number[];
  ec: number[];
  ph: number[];
  nitrogen: number[];
  phosphorus: number[];
  potassium: number[];
}

@Component({
  selector: 'data-component',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css'],
})

export class DataComponent implements OnInit {
  dateRange = 'day';
  public rowData: any[] = [];
  public colDefs: ColDef[] = [
    { field: "condition" },
    { field: "average" },
    { field: "median" },
    { field: "standardDeviation" },
    { field: "minValue" },
    { field: "maxValue" },
    { field: "percentile25" },
    { field: "percentile75" }
  ];

  autoSizeStrategy: any = {
    type: 'fitGridWidth',
  };

  public temperatureChartOptions: AgChartOptions | null = null;
  public moistureChartOptions: AgChartOptions | null = null;
  public salinityChartOptions: AgChartOptions | null = null;
  public phChartOptions: AgChartOptions | null = null;
  public npkChartOptions: AgChartOptions | null = null;

  constructor(private webService: WebService) {}

  ngOnInit() {
    this.webService.getAllDateRangeMeasurements().subscribe();
    this.updateChartDataBasedOnRange();
  }

  onTabChange(index: number) {
    const ranges = ['day', 'week', 'month'];
    this.dateRange = ranges[index];
    this.updateChartDataBasedOnRange();
  }

  processDataForGrid(data: SensorData[]) {
    const statistics: Statistics = {
      moisture: [],
      temperature: [],
      ec: [],
      ph: [],
      nitrogen: [],
      phosphorus: [],
      potassium: []
    };
    data.forEach(d => {
      statistics.moisture.push(d.Body.moisture);
      statistics.temperature.push(d.Body.temperature);
      statistics.ec.push(d.Body.ec);
      statistics.ph.push(d.Body.ph);
      statistics.nitrogen.push(d.Body.nitrogen);
      statistics.phosphorus.push(d.Body.phosphorus);
      statistics.potassium.push(d.Body.potassium);
    });

    return Object.keys(statistics).map(key => ({
      condition: key,
      ...this.calculateStatistics(statistics[key as keyof Statistics])
    }));
  }

  calculateStatistics(values: number[]) {
    values.sort((a, b) => a - b);
    const average = values.reduce((sum, val) => sum + val, 0) / values.length;
    const mid = Math.floor(values.length / 2);
    const median = values.length % 2 !== 0 ? values[mid] : (values[mid - 1] + values[mid]) / 2;
    const min = values[0];
    const max = values[values.length - 1];
    const percentile25 = values[Math.floor(0.25 * values.length)];
    const percentile75 = values[Math.floor(0.75 * values.length)];
    const variance = values.reduce((acc, val) => acc + (val - average) ** 2, 0) / values.length;
    const standardDeviation = Math.sqrt(variance);

    return {
      average: average.toFixed(2),
      standardDeviation: standardDeviation.toFixed(2),
      median: median.toFixed(2),
      minValue: min.toFixed(2),
      maxValue: max.toFixed(2),
      percentile25: percentile25.toFixed(2),
      percentile75: percentile75.toFixed(2)
    };
  }

  updateChartDataBasedOnRange() {
    let data: any;
    switch (this.dateRange) {
      case 'day':
        data = this.webService.dayData;
        break;
      case 'week':
        data = this.webService.weekData;
        break;
      case 'month':
        data = this.webService.monthData;
        break;
    }
    this.updateChartData(data);
    this.rowData = this.processDataForGrid(data);
  }

  private getTickInterval() {
    switch (this.dateRange) {
      case 'day':
        return time.hour.every(3);
      case 'week':
        return time.day.every(1);
      case 'month':
        return time.day.every(3);
    }
    return 'day';
  }

  private updateChartData(data: SensorData[]) {
    const formattedData = data.map((item) => ({
      datetime: new Date(item.Body.datetime),
      moisture: item.Body.moisture,
      temperature: item.Body.temperature,
      salinity: item.Body.ec,
      ph: item.Body.ph,
      nitrogen: item.Body.nitrogen,
      phosphorus: item.Body.phosphorus,
      potassium: item.Body.potassium,
    }));
    const tickInterval = this.getTickInterval();

    this.temperatureChartOptions = this.createChartOptions(
      formattedData,
      'temperature',
      'Temperature',
      'Degress Celcuius (°C)',
      tickInterval
    );
    this.moistureChartOptions = this.createChartOptions(
      formattedData,
      'moisture',
      'Moisture',
      'Moisutre Percentage (%)',
      tickInterval
    );
    this.salinityChartOptions = this.createChartOptions(
      formattedData,
      'salinity',
      'Salinity',
      'Microsiemen pr Centimeter (µS/cm)',
      tickInterval
    );
    this.phChartOptions = this.createChartOptions(
      formattedData,
      'ph',
      'pH',
      'pH Scale (pH)',
      tickInterval
    );
    this.npkChartOptions = this.createNpkChartOptions(
      formattedData,
      'Nitrogen, Phosphorus and Potassium',
      tickInterval
    );
  }

  private createChartOptions(
    data: any[],
    yKey: string,
    title: string,
    format: string,
    tickInterval: any
  ): AgChartOptions {
    return {
      autoSize: true,
      title: { text: `Soil ${title} Levels`, fontWeight: 'bold' },
      data: data,
      series: [
        {
          type: 'line',
          xKey: 'datetime',
          yKey: yKey,
          yName: title,
          marker: { enabled: false },
        },
      ],
      axes: [
        {
          type: 'time',
          position: 'bottom',
          tick: {
            interval: tickInterval,
          },
          title: { text: 'Time' },
        },
        {
          type: 'number',
          position: 'left',
          title: { text: format },
          label: {
            format: '#{.1f}',
          },
        },
      ],
      legend: { enabled: true, position: 'right' },
      background: {
        fill: 'rgba(0, 0, 0, 0)',
      },
    };
  }

  private createNpkChartOptions(
    data: any[],
    title: string,
    tickInterval: any
  ): AgChartOptions {
    return {
      autoSize: true,
      title: { text: `Soil ${title} Levels`, fontWeight: 'bold' },
      data: data,
      series: [
        {
          type: 'line',
          xKey: 'datetime',
          yKey: 'nitrogen',
          yName: 'Nitrogen',
          marker: { enabled: false },
        },
        {
          type: 'line',
          xKey: 'datetime',
          yKey: 'phosphorus',
          yName: 'Phosphorus',
          marker: { enabled: false },
        },
        {
          type: 'line',
          xKey: 'datetime',
          yKey: 'potassium',
          yName: 'Potassium',
          marker: { enabled: false },
        },
      ],
      axes: [
        {
          type: 'time',
          position: 'bottom',
          tick: {
            interval: tickInterval,
          },
          title: { text: 'Time' },
        },
        {
          type: 'number',
          position: 'left',
          title: { text: 'Milligrams per Kilogram (mg/kg)' },
          label: {
            format: '#{.1f}',
          },
        },
      ],
      legend: { enabled: true, position: 'right' },
      background: {
        fill: 'rgba(0, 0, 0, 0)',
      },
    };
  }
}
