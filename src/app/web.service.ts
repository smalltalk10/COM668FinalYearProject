import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { concatMap, tap } from 'rxjs/operators';

@Injectable()
export class WebService {
  constructor(private http: HttpClient) {}

  public dayData: any = [];
  public weekData: any = [];
  public monthData: any = [];

  createUser(registerForm: any) {
    let postData = new FormData();
    postData.append('username', registerForm.username);
    postData.append('email', registerForm.email);
    postData.append('password', registerForm.password);
    postData.append('deviceID', registerForm.deviceID);
    return this.http.post(
      'https://prod-15.uksouth.logic.azure.com/workflows/1b2c5e126c5b41e389d0bb63d2fc90d4/triggers/manual/paths/invoke/' +
        'rest/v1/user?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=hK7QlQm25PYY7y46HmVHj35p4HUwMdS-Tk0si0YZH0A',
      postData
    );
  }

  login(loginDetails: any) {
    const headers = new HttpHeaders()
      .set('username', loginDetails.username)
      .set('password', loginDetails.password)
      .set('Content-Type', 'application/json');

    return this.http.get(
      'https://prod-13.uksouth.logic.azure.com/workflows/0ea96f9b552947f5aae1f399ba91c283/triggers/manual/paths/invoke/' +
        'rest/v1/user/session?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=oFKwoT8a-IGsW62ZuAVLNH3gx7DxrCd2Gpnj6t-arEg',
      { headers }
    );
  }

  // Authenticated Requests
  getHeaders() {
    const token: string = sessionStorage.getItem('token') || '';
    return new HttpHeaders({
      'x-access-token': token,
    });
  }

  getCurrentMeasurements() {
    const headers = this.getHeaders();
    return this.http.get(
      'https://prod-05.uksouth.logic.azure.com/workflows/d2d30c052eec437f992963398acae520/triggers/manual/paths/invoke/' +
        'rest/v1/measurement?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=2dhbufTAe3z1ejRAPIJ14nOcON-KB_h2MVEqFATn_0U',
      { headers }
    );
  }

  fetchAllDateRangeMeasurements(): Observable<any> {
    const dateRanges = ['day', 'week', 'month'];
    let currentIndex = 0;
    return from(dateRanges).pipe(
      concatMap((range) => {
        return this.getDateRangeMeasurements(range).pipe(
          tap((data) => {
            switch (currentIndex) {
              case 0:
                this.dayData = data;
                break;
              case 1:
                this.weekData = data;
                break;
              case 2:
                this.monthData = data;
                break;
            }
            currentIndex++;
          })
        );
      })
    );
  }
  
  getDateRangeMeasurements(dateRange: string): Observable<any> {
    const headers = this.getHeaders();
    const url = `https://prod-05.uksouth.logic.azure.com/workflows/66a00b40d0054679a525c37e14669a2a/triggers/manual/paths/invoke/rest/v1/measurementsrange/?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=T5vPmM678LsJ0jnVkHzL1BXvA_NSEYdNSr0uCgQeVkc&daterange=${dateRange}`;

    return this.http.get(url, { headers });
  }

  getLocation() {
    const headers = this.getHeaders();
    return this.http.get(
      'https://prod-07.uksouth.logic.azure.com/workflows/8c15097cd0a74e5381cf2db5f43d8392/triggers/manual/paths/invoke/' +
        'rest/v1/location?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=wVrkl2_PUDs5OrjRedR6vSnRlt61VkogDYRiR20taJ8',
      { headers }
    );
  }

  updateLocation(markerPosition: any) {
    const headers = this.getHeaders();

    let postData = new FormData();
    postData.append('lat', markerPosition.lat);
    postData.append('lng', markerPosition.lng);

    return this.http.put(
      'https://prod-17.uksouth.logic.azure.com/workflows/eb495a1e82434a3e93cf80609f9b873b/triggers/manual/paths/invoke/' +
        'rest/v1/location?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=9c2p9N5xmrNbLycFNh5SVMnXXNuS6ELrti8tkiWYaCo',
      postData,
      { headers }
    );
  }
}
