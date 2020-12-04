import { Injectable } from '@angular/core';
import { Music } from '../music-list/music.model';
import { File } from '@ionic-native/file/ngx';
import { BehaviorSubject, Observable } from 'rxjs';
import { take, map, tap, delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class MusicserviceService {


  constructor(private file: File) {}
  music() {
    this.file.listDir(this.file.externalRootDirectory, 'Download')
      .then((data) => {
        // console.log(data);
        alert(data);
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < data.length; i++) {
          if (!data[i].isDirectory) {
            const directoryName = data[i].name;
            // alert(JSON.stringify(this.directoryName));
            const re = /(?:\.([^.]+))?$/;

            const ext = re.exec(data[i].name)[1];
            if (ext === 'mp3') {
              const musiclist = data[i].name;
            }
          }
        }
      });
  }

  // getSingleMusic() {
  //   // return this._music(id);
  // }



}
