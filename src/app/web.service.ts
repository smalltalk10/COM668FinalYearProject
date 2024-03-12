import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class WebService {
  constructor(private http: HttpClient) {}

  createUser(registerForm: any) {
    let postData = new FormData();
    postData.append('username', registerForm.username);
    postData.append('email', registerForm.email);
    postData.append('password', registerForm.password);
    postData.append('deviceID', registerForm.deviceID)
    return this.http.post('https://prod-15.uksouth.logic.azure.com/workflows/1b2c5e126c5b41e389d0bb63d2fc90d4/triggers/manual/paths/invoke/'+
    'rest/v1/users?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=hK7QlQm25PYY7y46HmVHj35p4HUwMdS-Tk0si0YZH0A', postData);
  }

  login(loginDetails: any) {
    const headers = new HttpHeaders()
      .set('username', loginDetails.username)
      .set('password', loginDetails.password)
      .set('Content-Type', 'application/json');

    return this.http.get('https://prod-13.uksouth.logic.azure.com/workflows/0ea96f9b552947f5aae1f399ba91c283/triggers/manual/paths/invoke/'+
    'rest/v1/users/session?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=oFKwoT8a-IGsW62ZuAVLNH3gx7DxrCd2Gpnj6t-arEg', 
    { headers });
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
      'https://prod-05.uksouth.logic.azure.com/workflows/d2d30c052eec437f992963398acae520/triggers/manual/paths/invoke/'+
      'rest/v1/measurement?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=2dhbufTAe3z1ejRAPIJ14nOcON-KB_h2MVEqFATn_0U',
      { headers });
    }
}
