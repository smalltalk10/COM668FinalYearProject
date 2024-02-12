import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class WebService {
  constructor(private http: HttpClient) {}
  
  getCurrentMeasurements() {
    return this.http.get(
        'https://prod-02.uksouth.logic.azure.com/workflows/db0bb4426e904ed6b6fa72ef7339f454/triggers/manual/paths/invoke/' +
        'rest/v1/measurements?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=oWtP_mCADQF8C4i5d1QqAF7CLM3Y0GsKweSL8B4Q8Mw'
      )
  }
}
