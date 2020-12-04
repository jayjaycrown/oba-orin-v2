import { Injectable } from '@angular/core';
import { Music } from '../music-list/music.model';
import { File } from '@ionic-native/file/ngx';
import { BehaviorSubject, Observable } from 'rxjs';
import { take, map, tap, delay } from 'rxjs/operators';
import { MediaObject, Media } from '@ionic-native/media/ngx';
import { Platform, NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class MusicserviceService {
  globalPlaying: MediaObject;
  globalCheck: any;
  nextMusicId: any;
  previousMusicId: any;
  // musicLists: Music[];
  title: any;
  artist: any;
  image = 'assets/img/obaorin.jpg';
  filename: any = 'Test Music';
  duration: any = -1;
  data: any;
  playing: MediaObject;
  player: MediaObject;
  // tslint:disable-next-line: variable-name
  selected_song: any;
  // tslint:disable-next-line: variable-name
  curr_playing_file: MediaObject;
  storageDirectory: any;
  // tslint:disable-next-line: variable-name
  play_The_track = ''; // note this specific url format is used in android only
  position: any = 0;
  // tslint:disable-next-line: variable-name
  get_position_interval: any;
  // tslint:disable-next-line: variable-name
  is_playing = false;
  // tslint:disable-next-line: variable-name
  is_in_play = false;
  // tslint:disable-next-line: variable-name
  is_ready = false;
  // tslint:disable-next-line: variable-name
  get_duration_interval: any;
  // tslint:disable-next-line: variable-name
  display_position: any = '00:00';
  // tslint:disable-next-line: variable-name
  display_duration: any = '00:00';
  // tslint:disable-next-line: variable-name
  current_id: any;
  id: any;
  dbo: any;
  musicList: any;
  constructor(
    private file: File, public platform: Platform,
    private media: Media,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private router: Router,
    ) {}
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

  stop() {
    this.curr_playing_file.stop();
    this.curr_playing_file.release();
    clearInterval(this.get_position_interval);
    this.position = 0;
  }


  // tslint:disable-next-line: variable-name
  createMedia(play_The_track): MediaObject {
    // try {
    //   this.stopv2();
    // } catch (error) {
    //   alert(error);
    // }
    if ( this.curr_playing_file != null ) {
      this.curr_playing_file.stop();
      this.curr_playing_file.release();
    }
    this.curr_playing_file = this.media.create(play_The_track);

    return this.curr_playing_file;
  }

  stopv2(){
    // alert(this.curr_playing_file);
    this.curr_playing_file.stop();
    this.curr_playing_file.release();
  }


}
