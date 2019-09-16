import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpEventType } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { FileService } from './file.service';

import { SystemConstants } from '../common/system.constants';
import { Observable } from 'rxjs';

export interface HttpOptions {
  headers?: {[key: string]: string};
  query?: {[key: string]: string};
}
@Injectable({
  providedIn: 'root'
})
export class DataService {

  private httpOptions;
  public onRequest = false;

  private headers: Headers;

  constructor(private _http: HttpClient, private _router: Router, private _authenService: AuthService, private fileService: FileService,) {
    let _header = {
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('TOKEN') ? 'Bearer ' + localStorage.getItem('TOKEN') : '!@#%$&*&*%^ERHDF#$^G',
      'charset': 'utf-8',
      'Accept': '*/*'
    };
    this.httpOptions = new HttpHeaders(_header);
  }

  get(uri: string, options: HttpOptions = {}): Observable<object> {
    
    return this._http.get(SystemConstants.BASE_API + uri, {  headers: new HttpHeaders(options.headers) });
  }

  post(uri: string, data: any, options: HttpOptions = {}): Observable<object> {
    return this._http.post(SystemConstants.BASE_API + uri, data, {
      headers: new HttpHeaders(options.headers),
    });
  }

  postFile(uri: string, data?: any, options: HttpOptions = {}) {
    return this._http.post(SystemConstants.BASE_API + uri, data, { headers: new HttpHeaders(options.headers) });
  }

  public getFileContent(url, params: any, options: any = {}): Observable<object> {
    let _httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('TOKEN') ? 'Bearer ' + localStorage.getItem('TOKEN') : '!@#%$&*&*%^ERHDF#$^G',
      'charset': 'utf-8',
      'Accept': '*/*',
    });

    let _options: any = {
      headers: _httpHeaders,
    }
    if (options) {
      _options = Object.assign(_options, options);
    }

    this.onRequest = true;
    return this._http.post(`${SystemConstants.BASE_API}${url}`, params, _options);
  }

  public downloadFileFromDataContent(url, params: any) {
    let options = {
      responseType: 'blob',
      observe: 'response'
    }
    this.getFileContent(url, params, options).subscribe(res => {
      let x = res['headers'].get('Content-Disposition');
      if (x) {
        let url = window.URL.createObjectURL(res['body']);
        let sFilename = x.split(';')[1].trim().split('=')[1];

        if (sFilename !== '') {
          this.fileService.download(url, sFilename);
        }
      } else {
        console.log('File doesn`t exists');
      }
    });
  }
}
