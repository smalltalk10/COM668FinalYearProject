import { Component, OnInit } from '@angular/core';
import { WebService } from '../../web.service';
import { AgChartOptions, time } from 'ag-charts-community';
import { ColDef } from 'ag-grid-community';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';

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

interface StatisticsData {
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
  title = 'Daily';

  sensorData: SensorData[] = [];
  statisticsData: any[] = [];
  rowData: any[] = [];
  colDefs: ColDef[] = [
    { field: 'condition' },
    { field: 'minValue' },
    { field: 'maxValue' },
    { field: 'average' },
    { field: 'median' },
    { field: 'standardDeviation' },
    { field: 'percentile25' },
    { field: 'percentile75' },
  ];

  autoSizeStrategy: any = {
    type: 'fitGridWidth',
  };

  temperatureChartOptions: AgChartOptions | null = null;
  moistureChartOptions: AgChartOptions | null = null;
  salinityChartOptions: AgChartOptions | null = null;
  phChartOptions: AgChartOptions | null = null;
  npkChartOptions: AgChartOptions | null = null;

  constructor(public webService: WebService, private router: Router) {}

  ngOnInit() {
    const token = sessionStorage.getItem('token');
    if (!token) {
      this.router.navigateByUrl('/');
    }
    this.webService
      .getAllDateRangeMeasurements()
      .subscribe((data: SensorData[]) => {
        this.sensorData = data;
        this.updateChartData(data);
        this.updateGridOptions(data);
        this.updateChartDataBasedOnRange();
      });
  }

  onTabChange(index: number) {
    const ranges = ['day', 'week', 'month'];
    this.dateRange = ranges[index];
    this.updateChartDataBasedOnRange();
  }

  createGridOptions(data: SensorData[]) {
    const statistics: StatisticsData = {
      moisture: [],
      temperature: [],
      ec: [],
      ph: [],
      nitrogen: [],
      phosphorus: [],
      potassium: [],
    };
    data.forEach((d) => {
      statistics.moisture.push(d.Body.moisture);
      statistics.temperature.push(d.Body.temperature);
      statistics.ec.push(d.Body.ec);
      statistics.ph.push(d.Body.ph);
      statistics.nitrogen.push(d.Body.nitrogen);
      statistics.phosphorus.push(d.Body.phosphorus);
      statistics.potassium.push(d.Body.potassium);
    });

    return Object.keys(statistics).map((key) => ({
      condition: key,
      ...this.calculateStatistics(statistics[key as keyof StatisticsData]),
    }));
  }

  updateChartDataBasedOnRange() {
    let data: any;
    switch (this.dateRange) {
      case 'day':
        data = this.webService.dayData;
        this.sensorData = data;
        this.title = 'Daily';
        break;
      case 'week':
        data = this.webService.weekData;
        this.sensorData = data;
        this.title = 'Weekly';
        break;
      case 'month':
        data = this.webService.monthData;
        this.sensorData = data;
        this.title = 'Monthly';
        break;
    }
    this.updateChartData(data);
    this.rowData = this.createGridOptions(data);
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
      'Degrees Celsius (°C)',
      tickInterval
    );
    this.moistureChartOptions = this.createChartOptions(
      formattedData,
      'moisture',
      'Moisture Percentage (%)',
      tickInterval
    );
    this.salinityChartOptions = this.createChartOptions(
      formattedData,
      'salinity',
      'Microsiemen per Centimeter (µS/cm)',
      tickInterval
    );
    this.phChartOptions = this.createChartOptions(
      formattedData,
      'ph',
      'pH Scale (pH)',
      tickInterval
    );
    this.npkChartOptions = this.createNpkChartOptions(
      formattedData,
      tickInterval
    );
  }

  private createChartOptions(
    data: any[],
    yKey: string,
    format: string,
    tickInterval: any
  ): AgChartOptions {
    return {
      autoSize: true,
      height: 290,
      data: data,
      series: [
        {
          type: 'line',
          xKey: 'datetime',
          yKey: yKey,
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
      legend: { enabled: true, position: 'top' },
    };
  }

  private createNpkChartOptions(
    data: any[],
    tickInterval: any
  ): AgChartOptions {
    return {
      autoSize: true,
      height: 290,
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
      legend: { enabled: true, position: 'top' },
    };
  }

  private updateGridOptions(data: SensorData[]) {
    this.statisticsData = this.createGridOptions(data);
    this.rowData = this.statisticsData;
  }

  calculateStatistics(values: number[]) {
    if (values.length === 0) {
      return {
        average: 'N/A',
        standardDeviation: 'N/A',
        median: 'N/A',
        minValue: 'N/A',
        maxValue: 'N/A',
        percentile25: 'N/A',
        percentile75: 'N/A',
      };
    }

    values.sort((a, b) => a - b);
    const average = values.reduce((sum, val) => sum + val, 0) / values.length;
    const mid = Math.floor(values.length / 2);
    const median =
      values.length % 2 !== 0
        ? values[mid]
        : (values[mid - 1] + values[mid]) / 2;
    const min = values[0];
    const max = values[values.length - 1];
    const percentile25 = values[Math.floor(0.25 * values.length)];
    const percentile75 = values[Math.floor(0.75 * values.length)];
    const variance =
      values.reduce((acc, val) => acc + (val - average) ** 2, 0) /
      values.length;
    const standardDeviation = Math.sqrt(variance);

    return {
      average: average.toFixed(2),
      standardDeviation: standardDeviation.toFixed(2),
      median: median.toFixed(2),
      minValue: min.toFixed(2),
      maxValue: max.toFixed(2),
      percentile25: percentile25.toFixed(2),
      percentile75: percentile75.toFixed(2),
    };
  }

  exportToCsv() {
    if (!this.sensorData || this.sensorData.length === 0) {
      return;
    }

    const header = this.colDefs.map((colDef) => colDef.headerName).join(',');
    const rows = this.sensorData.map((row) => {
      return [
        row.Body.datetime,
        row.Body.temperature,
        row.Body.moisture,
        row.Body.ec,
        row.Body.ph,
        row.Body.nitrogen,
        row.Body.phosphorus,
        row.Body.potassium,
      ].join(',');
    });
    const csvContent = [header, ...rows].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${this.dateRange}_soil_sensor_data.csv`);
  }
}
