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
      'https://prod-15.uksouth.logic.azure.com/workflows/1b2c5e126c5b41e389d0bb63d2fc90d4/triggers/manual/paths/invoke/rest/v1/user' +
      '?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=hK7QlQm25PYY7y46HmVHj35p4HUwMdS-Tk0si0YZH0A',
      postData
    );
  }

  login(loginDetails: any) {
    const headers = new HttpHeaders()
      .set('username', loginDetails.username)
      .set('password', loginDetails.password)
      .set('Content-Type', 'application/json');

    return this.http.get(
      'https://prod-13.uksouth.logic.azure.com/workflows/0ea96f9b552947f5aae1f399ba91c283/triggers/manual/paths/invoke/rest/v1/user/session' +
      '?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=oFKwoT8a-IGsW62ZuAVLNH3gx7DxrCd2Gpnj6t-arEg',
      { headers }
    );
  }

  getHeaders() {
    const token: string = sessionStorage.getItem('token') || '';
    return new HttpHeaders({
      'x-access-token': token,
    });
  }

  getCurrentMeasurements() {
    const headers = this.getHeaders();
    return this.http.get(
      'https://prod-05.uksouth.logic.azure.com/workflows/d2d30c052eec437f992963398acae520/triggers/manual/paths/invoke/rest/v1/measurement' +
      '?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=2dhbufTAe3z1ejRAPIJ14nOcON-KB_h2MVEqFATn_0U',
      { headers }
    );
  }

  getAllDateRangeMeasurements(): Observable<any> {
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
    const url = `https://prod-05.uksouth.logic.azure.com/workflows/66a00b40d0054679a525c37e14669a2a/triggers/manual/paths/invoke/rest/v1/measurementsrange/` + 
    `?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=T5vPmM678LsJ0jnVkHzL1BXvA_NSEYdNSr0uCgQeVkc&daterange=${dateRange}`;

    return this.http.get(url, { headers });
  }

  getLocation() {
    const headers = this.getHeaders();
    return this.http.get(
      'https://prod-07.uksouth.logic.azure.com/workflows/8c15097cd0a74e5381cf2db5f43d8392/triggers/manual/paths/invoke/rest/v1/location' +
      '?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=wVrkl2_PUDs5OrjRedR6vSnRlt61VkogDYRiR20taJ8',
      { headers }
    );
  }

  updateLocation(markerPosition: any) {
    const headers = this.getHeaders();

    let postData = new FormData();
    postData.append('lat', markerPosition.lat);
    postData.append('lng', markerPosition.lng);

    return this.http.put(
      'https://prod-17.uksouth.logic.azure.com/workflows/eb495a1e82434a3e93cf80609f9b873b/triggers/manual/paths/invoke/rest/v1/location' +
      '?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=9c2p9N5xmrNbLycFNh5SVMnXXNuS6ELrti8tkiWYaCo',
      postData,
      { headers }
    );
  }

  getAllThresholds() {
    const headers = this.getHeaders();
    return this.http.get(
      'https://prod-16.uksouth.logic.azure.com/workflows/c68ed87977844e46a5847468d7c38dab/triggers/manual/paths/invoke/rest/v1/thresholds' +
      '?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=UT0iyusoJu7ihYkypab-D6Hn8u--w6K_abqVPOiFeVo',
      { headers }
    );
  }

  createThreshold(thresholdForm: any, conditions: any) {

    const headers = this.getHeaders();
    let postData = new FormData();
    postData.append('name', thresholdForm.name);
    postData.append('temperatureMin', conditions[0].currentLowValue);
    postData.append('temperatureMax', conditions[0].currentHighValue);
    postData.append('moistureMin', conditions[1].currentLowValue);
    postData.append('moistureMax', conditions[1].currentHighValue);
    postData.append('ecMin', conditions[2].currentLowValue);
    postData.append('ecMax', conditions[2].currentHighValue);
    postData.append('phMin', conditions[3].currentLowValue);
    postData.append('phMax', conditions[3].currentHighValue);
    postData.append('nitrogenMin', conditions[4].currentLowValue);
    postData.append('nitrogenMax', conditions[4].currentHighValue);
    postData.append('phosphorusMin', conditions[5].currentLowValue);
    postData.append('phosphorusMax', conditions[5].currentHighValue);
    postData.append('potassiumMin', conditions[6].currentLowValue);
    postData.append('potassiumMax', conditions[6].currentHighValue);
    postData.append('isActive', 'false');


    return this.http.post(
      'https://prod-11.uksouth.logic.azure.com/workflows/c0a5bf9340ac4e02a96a8f2e322faa6c/triggers/manual/paths/invoke/rest/v1/threshold' + 
      '?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=63CeU9S_gGM4jnb0x_ZDX4qnF_awLEQ8ocUqlW5NTq4',
      postData,
      { headers }
    );
  }

  updateThreshold(id: string, thresholdForm: any, conditions: any) {
    const headers = this.getHeaders();
    let postData = new FormData();
    postData.append('name', thresholdForm.name);
    postData.append('temperatureMin', conditions[0].currentLowValue);
    postData.append('temperatureMax', conditions[0].currentHighValue);
    postData.append('moistureMin', conditions[1].currentLowValue);
    postData.append('moistureMax', conditions[1].currentHighValue);
    postData.append('ecMin', conditions[2].currentLowValue);
    postData.append('ecMax', conditions[2].currentHighValue);
    postData.append('phMin', conditions[3].currentLowValue);
    postData.append('phMax', conditions[3].currentHighValue);
    postData.append('nitrogenMin', conditions[4].currentLowValue);
    postData.append('nitrogenMax', conditions[4].currentHighValue);
    postData.append('phosphorusMin', conditions[5].currentLowValue);
    postData.append('phosphorusMax', conditions[5].currentHighValue);
    postData.append('potassiumMin', conditions[6].currentLowValue);
    postData.append('potassiumMax', conditions[6].currentHighValue);
    postData.append('isActive', 'false');

    return this.http.put(
      `https://prod-19.uksouth.logic.azure.com/workflows/647907c970e44c2396813349e08c2af0/triggers/manual/paths/invoke/rest/v1/threshold/${id}` + 
      '?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=1yeCmUYiL1mktBSsqurvItrU_vlZJoQ_W4f9zdi0u8E',
      postData,
      { headers }
    );
  }

  activateThreshold(id: string, isActive: boolean) {
    console.log(isActive.toString())
    const headers = this.getHeaders();
    let postData = new FormData();
    postData.append('isActive', isActive.toString());

    return this.http.patch(
      `https://prod-04.uksouth.logic.azure.com/workflows/350da3b477f94a70a9cbe7bebd3a26eb/triggers/manual/paths/invoke/rest/v1/threshold/${id}/activate` + 
      '?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=hoUir9AARb7CFxKgFJgZ-dPEJ0gI7Ef2Y02cs5jnm_Q',
      postData,
      { headers }
    );
  }
  
  deleteThreshold(id: string) {
    const headers = this.getHeaders();
    return this.http.delete(
      `https://prod-10.uksouth.logic.azure.com/workflows/3c81e07d3615461fb4b7f5f7d27c297b/triggers/manual/paths/invoke/rest/v1/threshold/${id}`+
      '?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=1ejNVCGm1b1vOVJOhIjTw98CzDI5UQmqteSm6DuaMJs',
      { headers }
    );
  }
}
