// import { FcmService } from './../services/fcm.service';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { of, Observable, Subject, throwError, BehaviorSubject } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Device } from '@ionic-native/device/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

// import { Uid } from '@ionic-native/uid/ngx';
// import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Platform } from '@ionic/angular';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    Accept: 'application/fhir+json',
    AUTHORIZATION: ' [jwt]',
    'X-Requested-With': 'XMLHttpRequest',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class APIServiceService {

  deviceId: any;
  app_data: any;
  mloaded: any;
  sloaded: any;
  // tslint:disable-next-line: variable-name
  private _refreshNeded$ = new Subject<void>();
  refreshNeded$() {
    return this._refreshNeded$;
  }

  constructor(
    private http: HttpClient,
    private storage: NativeStorage,
    private router: Router,
    // private uid: Uid,
    // private androidPermissions: AndroidPermissions,
    private device: Device,
    private platform: Platform,
    // private fcm: FcmService,

  ) {
    this.platform.ready().then(async() => {
      this.deviceId = device.uuid;
      await this.storage.getItem('app_data').then(async (lists) => {
        this.app_data = lists;
        if(this.app_data.notification_id == ''){
          // this.fcm.initPush();
         
        }
          //  alert(JSON.stringify(lists));
    
        });
      // this.getImei();
    });
  }

  register(data) {
    let httpOptions = {
      headers: new HttpHeaders({
          'enctype': 'multipart/form-data; boundary=----WebKitFormBoundaryuL67FWkv1CA',   
      })
  };
  let formData = new FormData();
  formData.append('name',data.name);
  formData.append('phone_number',data.phone);
  formData.append('password',data.password);
  formData.append('email',data.email);
    const url = 'http://teshost.com/obaorin/app_api?method=register&device_id='+this.deviceId;
    return this.http.post(url, formData,httpOptions).pipe(
      catchError(this.handleError('register', data))
    )
  }

  generateAccount(){
    httpOptions.headers = httpOptions.headers.set(
      'Access-Control-Allow-Origin',
      '*'
    );
    httpOptions.headers = httpOptions.headers.set(
      'Content-Type',
      'text/html'
    );
    const url = 'http://teshost.com/obaorin/app_api?method=generateAccount&device_id='+this.deviceId+'&api_token='+this.app_data.api_token;
    return this.http.post(url, httpOptions, {responseType: 'text'}).pipe(
      retry(3),
      catchError(this.handleError('getSearchLyrics'))
    );
  }

  getDetails(){
    httpOptions.headers = httpOptions.headers.set(
      'Access-Control-Allow-Origin',
      '*'
    );
    httpOptions.headers = httpOptions.headers.set(
      'Content-Type',
      'text/html'
    );
    const url = 'http://teshost.com/obaorin/app_api?method=details&device_id='+this.deviceId+'&api_token='+this.app_data.api_token;
    return this.http.post(url, httpOptions, {responseType: 'text'}).pipe(
      retry(3),
      catchError(this.handleError('getSearchLyrics'))
    );
  }

  updateFCM(){
    httpOptions.headers = httpOptions.headers.set(
      'Access-Control-Allow-Origin',
      '*'
    );
    httpOptions.headers = httpOptions.headers.set(
      'Content-Type',
      'text/html'
    );
    const url = 'http://teshost.com/obaorin/app_api?method=notification_id&device_id='+this.deviceId+'&api_token='+this.app_data.api_token+'&notification_id='+this.app_data.notification_id;
    return this.http.post(url, httpOptions, {responseType: 'text'}).pipe(
      retry(3),
      catchError(this.handleError('getSearchLyrics'))
    );
  }

  async checkLoggedIn(){
    // alert(this.app_data);
    // await setTimeout(async () => {
      
    //   alert(this.app_data);
      if(this.app_data === undefined || !this.app_data.api_token){
        await this.storage.remove('app_data');
        this.router.navigateByUrl('/login')
      }
    // },5000);
    
    
  }

  async logout(){
    await this.storage.remove('app_data');
    this.app_data = undefined;
    this.router.navigateByUrl('/login')
    // await this.checkLoggedIn();
    
  }

  login(data) {
    // alert(this.app_data.username);
    let httpOptions = {
      headers: new HttpHeaders({
          'enctype': 'multipart/form-data; boundary=----WebKitFormBoundaryuL67FWkv1CA',   
      })
  };
  let formData = new FormData();
  formData.append('username',data.username);
  formData.append('password',data.password);
    const url = 'http://teshost.com/obaorin/app_api?method=login&device_id='+this.deviceId;
    return this.http.post(url, formData,httpOptions).pipe(
      catchError(this.handleError('login', data))
    )
  }

  

  getSearchLyrics(lyrics) {
    httpOptions.headers = httpOptions.headers.set(
      'Access-Control-Allow-Origin',
      '*'
    );
    httpOptions.headers = httpOptions.headers.set(
      'Content-Type',
      'text/html'
    );
    const url = 'http://teshost.com/obaorin/app_api?method=searchlyrics&keyword='+lyrics+'&device_id='+this.deviceId+'&api_token='+this.app_data.api_token;
    return this.http.post(url, httpOptions, {responseType: 'text'}).pipe(
      retry(3),
      catchError(this.handleError('getSearchLyrics'))
    );
  }

  getFeatured() {
    httpOptions.headers = httpOptions.headers.set(
      'Access-Control-Allow-Origin',
      '*'
    );
    httpOptions.headers = httpOptions.headers.set(
      'Content-Type',
      'text/html'
    );
    const url = 'http://teshost.com/obaorin/app_api?method=featured';
    return this.http.post(url, httpOptions, {responseType: 'text'}).pipe(
      retry(3),
      catchError(this.handleError('getFeatured'))
    );
  }

  async getBanners() {
    httpOptions.headers = httpOptions.headers.set(
      'Access-Control-Allow-Origin',
      '*'
    );
    httpOptions.headers = httpOptions.headers.set(
      'Content-Type',
      'text/html'
    );
    const url = 'http://teshost.com/obaorin/app_api?method=banners';
    return await this.http.post(url, httpOptions, {responseType: 'text'}).pipe(
      retry(3),
      catchError(this.handleError('getBanners'))
    );
  }

  getMostDownloaded() {
    httpOptions.headers = httpOptions.headers.set(
      'Access-Control-Allow-Origin',
      '*'
    );
    httpOptions.headers = httpOptions.headers.set(
      'Content-Type',
      'text/html'
    );
    const url = 'http://teshost.com/obaorin/app_api?method=most_downloaded';
    return this.http.post(url, httpOptions, {responseType: 'text'}).pipe(
      retry(3),
      catchError(this.handleError('getMostDownloaded'))
    );
  }

  getLyricsDetails(title, type, url) {
    httpOptions.headers = httpOptions.headers.set(
      'Access-Control-Allow-Origin',
      '*'
    );
    httpOptions.headers = httpOptions.headers.set(
      'Content-Type',
      'text/html'
    );

    return this.http.post(
      `http://teshost.com/obaorin/app_api?method=grablyrics&url=${url}&type=${type}&name=${title}`+'&device_id='+this.deviceId+'&api_token='+this.app_data.api_token,
      httpOptions, { responseType: 'text' }).pipe(
      retry(3),
      catchError(this.handleError('getLyricsDetails'))
    );
  }

  getSearchMusic(music) {
    httpOptions.headers = httpOptions.headers.set(
      'Access-Control-Allow-Origin',
      '*'
    );
    httpOptions.headers = httpOptions.headers.set(
      'Content-Type',
      'text/html'
    );
    const url = 'http://teshost.com/obaorin/app_api?method=searchMusic&keyword='+music+'&device_id='+this.deviceId+'&api_token='+this.app_data.api_token;
    return this.http.post(url, httpOptions, {responseType: 'text'}).pipe(
      retry(3),
      catchError(this.handleError('getSearchMusic'))
    );
  }


  getSearchMusicDetails(title, tag, url, type) {
    httpOptions.headers = httpOptions.headers.set(
      'Access-Control-Allow-Origin',
      '*'
    );
    httpOptions.headers = httpOptions.headers.set(
      'Content-Type',
      'text/html'
    );
    const urls = `http://teshost.com/obaorin/app_api?method=DownloadMusic&url=${url}&type=${type}&tag=${tag}&title=${title}`+'&device_id='+this.deviceId+'&api_token='+this.app_data.api_token;
    return this.http.post(urls, httpOptions, {responseType: 'text'}).pipe(
      retry(3),
      catchError(this.handleError('getSearchMusicDetails'))
    );
  }

  handleError<T>(operation = 'operation', result?: T) {
    let errorMessage = 'Unknown error!';
    return (error: HttpErrorResponse): Observable<T> => {
      if (error.error instanceof ErrorEvent) {
        errorMessage = `Error: ${error.message}`;
      } else {
        errorMessage = `${error.message}`;
        return throwError(errorMessage);
      }
      alert(errorMessage);

      // console.error(error);
      this.log(`${operation} failed: ${error.message}`);

      return of(result as T);
    };
  }

  private log(message: string) {
    // console.log(message);
    alert(message);
  }
}
