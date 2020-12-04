import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MediaObject, Media } from '@ionic-native/media/ngx';
import { Platform, LoadingController, NavController } from '@ionic/angular';


import { MusicserviceService } from '../../../../home/music-list/musicservice.service';
import { APIServiceService } from '../../../../service/apiservice.service';

@Component({
  selector: 'app-music-select',
  templateUrl: './music-select.page.html',
  styleUrls: ['./music-select.page.scss'],
})
// tslint:disable-next-line: component-class-suffix
export class MusicSelectPage implements OnInit {

  id;
  musicDetails: any;
  musicContent: any;
  nextMusicId: any;
  previousMusicId: any;
  // musicLists: Music[];
  title: any;
  artist: any;
  image = 'assets/img/obaorin.jpg';
  filename: any = 'Test Music';
  duration: any = -1;
  data: any;
  // tslint:disable-next-line: variable-name
  curr_playing_file: MediaObject;
  storageDirectory: any;
  // tslint:disable-next-line: variable-name
  // play_The_track = ''; // note this specific url format is used in android only
  play_The_track: string = "";
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
  dbo: any;
  musicList: any;
  constructor(
    private api: APIServiceService,
    public loadingCtrl: LoadingController,
    private musicService: MusicserviceService,
    private route: ActivatedRoute,
    private router: Router,
    private media: Media,
    private platform: Platform
  ) { }

  async ngOnInit() {
    this.route.paramMap.subscribe(async (params) => {
      if (!params.has('id')) {
        this.router.navigate(['/home/tabs/lyrics']);
      }
      this.id = params.get('id');
      let str;
      str = window.atob(this.id);
      //  alert(str);
      str = str.split('~');
      await this.getMusicDetails(str[0], str[3], str[1], str[2]);
      // alert(this.play_The_track);
      this.title = decodeURIComponent(str[0]);
      // await this.prepareAudioFile();
      
    });

  }

  async getMusicDetails(title, tag, url, type) {
    const loading = this.loadingCtrl.create({
      keyboardClose: true,
      message: `
                <div class="custom-spinner-container">
                  <div class="custom-spinner-box"></div>
                </div>`
    });

    (await loading).present();
    this.api.getSearchMusicDetails(title, tag, url, type).subscribe(async (res: any) => {
      this.musicDetails = JSON.parse(res);
      this.musicDetails = this.musicDetails.result;
      this.musicContent = this.musicDetails.content;

      this.play_The_track = this.musicDetails;
      // alert(this.play_The_track);
      await this.prepareAudioFile();
      (await loading).dismiss();
    }, async err => {
        (await loading).dismiss();
        alert(err);
    });
  }

  prepareAudioFile() {
    // alert(1)
    this.platform.ready().then((res) => {
      // this.getDuration();
      this.duration = 1000;
      this.setToPlayback();
      // this.play();
      // setTimeout(() => {
      //   // alert(1);
      //   // alert(this.display_duration);
      //   if (this.display_duration === '00:00') {
      //     // this.next();
      //   } else {
      //   // this.curr_playing_file = this.media.create(this.play_The_track);
      //     this.play();
      //   }
      // }, 1000);
    });
  }

  async getDuration() {
    // alert(this.title);
    // this.curr_playing_file = this.media.create(this.play_The_track);
    // this.curr_playing_file.onStatusUpdate.subscribe(status => alert('status>>>>>>>>>'+ status)); // fires when file status changes
    // this.curr_playing_file.onSuccess.subscribe(() => alert('Action is successful'));
    // this.curr_playing_file.onError.subscribe(error => alert(JSON.stringify(error))); 
    // this.duration = this.curr_playing_file.getDuration();
    // alert(this.duration);
    // this.curr_playing_file = await this.musicService.createMedia(this.play_The_track);
    // alert(JSON.stringify(this.curr_playing_file));
    // on occassions, the plugin only gives duration of the file if the file is played
    // at least once
    this.curr_playing_file.play();

    // this.curr_playing_file.setVolume(9000.0); // you don't want users to notice that you are playing the file
    const self = this;
    // The plugin does not give the correct duration on playback start
    // Need to check for duration repeatedly
    // tslint:disable-next-line: variable-name
    let temp_duration = self.duration;
    this.get_duration_interval = setInterval(() => {
      if (self.duration === -1 || !self.duration) {
        // tslint:disable-next-line: no-bitwise
        self.duration = ~~self.curr_playing_file.getDuration(); // make it an integer
      } else {
        if (self.duration !== temp_duration) {
          temp_duration = self.duration;
        } else {
          self.curr_playing_file.stop();
          self.curr_playing_file.release();

          clearInterval(self.get_duration_interval);
          this.display_duration = this.toHHMMSS(self.duration);
          self.setToPlayback();
        }
      }
    }, 100);
  }

  setToPlayback() {
    this.curr_playing_file = this.musicService.createMedia(this.play_The_track);
    // this.curr_playing_file = this.media.create(this.play_The_track);
    // alert(JSON.stringify(this.curr_playing_file));
    this.curr_playing_file.onStatusUpdate.subscribe(status => {//alert('status>>>>>>>>>'+ status)
  }
    ); // fires when file status changes
    this.curr_playing_file.onSuccess.subscribe(() => {//alert('Action is successful')
  }
    );
    this.curr_playing_file.onError.subscribe(error => {//alert(JSON.stringify(error))
    }
    );
    this.curr_playing_file.onStatusUpdate.subscribe((status) => {
      switch (status) {
        case 1:
          break;
        case 2: // 2: playing
          this.is_playing = true;
          break;
        case 3: // 3: pause
          this.is_playing = false;
          break;
        case 4: // 4: stop
        default:
          this.is_playing = false;
          break;
      }
    });
    this.is_ready = true;
    this.getAndSetCurrentAudioPosition();
  }

  getAndSetCurrentAudioPosition() {
    const diff = 1;
    const self = this;
    this.get_position_interval = setInterval(() => {
      // tslint:disable-next-line: variable-name
      const last_position = self.position;
      self.curr_playing_file.getCurrentPosition().then((position) => {
        if (position >= 0 && position < self.duration) {
          if (Math.abs(last_position - position) >= diff) {
            // set position
            self.curr_playing_file.seekTo(last_position * 1000);
          } else {
            // update position for display
            self.position = position;
            this.display_position = this.toHHMMSS(self.position);
          }
        } else if (position >= self.duration) {
          self.stop();
          self.setToPlayback();
          // this.next();
        }
      });
    }, 100);
  }

  play() {
    this.curr_playing_file.play();
    let temp_duration = this.duration;
    this.get_duration_interval = setInterval(() => {
      if (this.duration === -1 || !this.duration) {
        // tslint:disable-next-line: no-bitwise
        this.duration = ~~this.curr_playing_file.getDuration(); // make it an integer
      } else {
        if (this.duration !== temp_duration) {
          temp_duration = this.duration;
        } else {
          clearInterval(this.get_duration_interval);
          this.display_duration = this.toHHMMSS(this.duration);
          // this.setToPlayback();
        }
      }
    }, 100);
  }

  pause() {
    this.curr_playing_file.pause();
  }

  stop() {
    this.curr_playing_file.stop();
    this.curr_playing_file.release();
    clearInterval(this.get_position_interval);
    this.position = 0;
  }

  controlSeconds(action) {
    const step = 5;
    const numberRange = this.position;
    switch (action) {
      case 'back':
        this.position = numberRange < step ? 0.001 : numberRange - step;
        break;
      case 'forward':
        this.position =
          numberRange + step < this.duration
            ? numberRange + step
            : this.duration;
        break;
      default:
        break;
    }
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnDestroy() {
    this.stop();
  }

  toHHMMSS(secs) {
    // tslint:disable-next-line: variable-name
    const sec_num = parseInt(secs, 10);
    const minutes = Math.floor(sec_num / 60) % 60;
    const seconds = sec_num % 60;

    return [minutes, seconds]
      .map((v) => (v < 10 ? '0' + v : v))
      .filter((v, i) => v !== '00' || i >= 0)
      .join(':');
  }

}
