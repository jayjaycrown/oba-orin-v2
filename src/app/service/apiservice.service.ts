import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { of, Observable, Subject, throwError, BehaviorSubject } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Uid } from '@ionic-native/uid/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
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

  // tslint:disable-next-line: variable-name
  private _refreshNeded$ = new Subject<void>();
  refreshNeded$() {
    return this._refreshNeded$;
  }

  constructor(
    private http: HttpClient,
    private uid: Uid,
    private androidPermissions: AndroidPermissions,
    private platform: Platform
  ) {
    this.platform.ready().then(() => {
      // this.getImei();
    });
  }
  // async getImei() {
  //   const { hasPermission } = await this.androidPermissions.checkPermission(
  //     this.androidPermissions.PERMISSION.READ_PRIVILEGED_PHONE_STATE
  //   );

  //   if (!hasPermission) {
  //     const result = await this.androidPermissions.requestPermission(
  //       this.androidPermissions.PERMISSION.READ_PRIVILEGED_PHONE_STATE
  //     );

  //     if (!result.hasPermission) {
  //       throw new Error('Permissions required');
  //     }

  //     // ok, a user gave us permission, we can get him identifiers after restart app
  //     return;
  //   }

  //   return this.uid.IMEI;
  // }

  getSearchLyrics(lyrics) {
    httpOptions.headers = httpOptions.headers.set(
      'Access-Control-Allow-Origin',
      '*'
    );
    httpOptions.headers = httpOptions.headers.set(
      'Content-Type',
      'text/html'
    );
    const url = 'http://teshost.com/obaorin/app_api?method=searchlyrics&keyword=';
    return this.http.post(url + lyrics, httpOptions, {responseType: 'text'}).pipe(
      retry(3),
      catchError(this.handleError('getSearchLyrics'))
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
      `http://teshost.com/obaorin/app_api?method=grablyrics&url=${url}&type=${type}&name=${title}`,
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
    const url = 'http://teshost.com/obaorin/app_api?method=searchMusic&keyword=';
    return this.http.post(url + music, httpOptions, {responseType: 'text'}).pipe(
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
    const urls = `http://teshost.com/obaorin/app_api?method=DownloadMusic&url=${url}&type=${type}&tag=3${tag}&title=${title}`;
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
