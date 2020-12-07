import { MusicserviceService } from './../../../../home/music-list/musicservice.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MediaObject, Media } from '@ionic-native/media/ngx';
import { Platform, LoadingController, NavController } from '@ionic/angular';
// import { Music } from '../music.model';
import { Storage } from '@ionic/storage';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { Plugins } from '@capacitor/core';
const { CapacitorMusicControls } = Plugins;
@Component({
  selector: 'app-music-detail',
  templateUrl: './music-detail.page.html',
  styleUrls: ['./music-detail.page.scss'],
})
// tslint:disable-next-line: component-class-suffix
export class MusicDetailPage implements OnInit {
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
  play_The_track = ''; // note this specific url format is used in android only
  background = false;
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
  next_interval;
  id: any;
  running;
  dbo: any;
  musicList: any;
 
  constructor(
    public platform: Platform,
    private media: Media,
    private musicService: MusicserviceService,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private storage: NativeStorage,
    private router: Router,
    private sqlite: SQLite,
    private sqlitePorter: SQLitePorter,
    private backgroundMode: BackgroundMode,
  ) {
    this.platform.ready().then(() => {
      // this.createDB();
    }).catch(error => {
      // console.log(error);
    });
  }

  goHome() {}
  
  async ngOnInit() {
    this.backgroundMode.enable();
    this.backgroundMode.on("activate").subscribe(()=>{
      this.background  = true;
      // alert(this.background);
    });
    this.backgroundMode.on("deactivate").subscribe(()=>{
      this.background  = false;
      // alert(this.background);
    });
    // alert(this.musicList);
    await this.createDB();
    this.route.paramMap.subscribe(async (params) => {
      if (!params.has('id')) {
        this.router.navigate(['/home/tabs/libraries/music-list']);
      }
      this.id = params.get('id');
      // tslint:disable-next-line: radix
      let nnext = parseInt(this.id) + 1;
      // tslint:disable-next-line: radix
      let pprevious = parseInt(this.id) - 1;
      this.nextMusicId = nnext;
      this.previousMusicId = pprevious;

      // alert(this.id);
      // alert(nnext);
      // alert(pprevious);
      // alert(JSON.stringify(this.musicList));
      await this.GetTable(this.id);
      if(this.data == null){
        this.router.navigate(['/home/tabs/libraries/music-list']);
      }
      // alert(this.data);
      let selected_song = JSON.parse(this.data);
      // alert(selected_song[0].fullpath);
      this.title = selected_song[0].name;
      this.play_The_track = selected_song[0].fullpath;
      this.prepareAudioFile();
      this.loadingCtrl
        .create({
          keyboardClose: true,
          message: `
                <div class="custom-spinner-container">
                  <div class="custom-spinner-box"></div>
                </div>`,
        })
        .then((loadingEl) => {
          loadingEl.present();
          // this.getListDetail(this.id);
          // this.getItems(this.id);
          // this.getItemss(this.id);
          loadingEl.dismiss();
        });
    });

  }

  prepareAudioFile() {
    // alert(1)
    this.platform.ready().then((res) => {
      this.getDuration();
      setTimeout(() => {
        // alert(1);
        // alert(this.display_duration);
        if(!this.background){
        if (this.display_duration === '00:00') {
          // this.next();
        } else if(this.display_position == "00:00") {
          if(this.musicService.running == 'next' || this.musicService.running == 'all'){
            this.play();
          }
          
        }else{
          // this.stop();
          // alert("Please Wait");
          // this.stop();
          // this.ngOnInit();
          location.reload();
          
        }
      }
      }, 1000);
    });
  }
  getDuration() {
    // alert(this.title);
    //this.curr_playing_file = this.media.create(this.play_The_track);
    this.curr_playing_file = this.musicService.createMedia(this.play_The_track)
    // alert(this.play_The_track)
    // on occassions, the plugin only gives duration of the file if the file is played
    // at least once
    this.curr_playing_file.play();

    this.curr_playing_file.setVolume(0.0); // you don't want users to notice that you are playing the file
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
    // alert(2);
    this.curr_playing_file = this.musicService.createMedia(this.play_The_track);
    CapacitorMusicControls.create({
      track       : this.title,		// optional, default : ''
      artist      : 'ObaOrin',						// optional, default : ''
      album       : '',     // optional, default: ''
       cover       : '',		// optional, default : nothing
      // cover can be a local path (use fullpath 'file:///storage/emulated/...', or only 'my_image.jpg' if my_image.jpg is in the www folder of your app)
      //			 or a remote url ('http://...', 'https://...', 'ftp://...')
    
      // hide previous/next/close buttons:
      hasPrev   : false,		// show previous button, optional, default: true
      hasNext   : false,		// show next button, optional, default: true
      hasClose  : true,		// show close button, optional, default: false
    
      // iOS only, optional
      duration : '', // optional, default: 0
      elapsed : '', // optional, default: 0
        hasSkipForward : true, //optional, default: false. true value overrides hasNext.
        hasSkipBackward : true, //optional, default: false. true value overrides hasPrev.
        skipForwardInterval : 15, //optional. default: 15.
      skipBackwardInterval : 15, //optional. default: 15.
      hasScrubbing : false, //optional. default to false. Enable scrubbing from control center progress bar 
    
        // Android only, optional
        isPlaying   : false,							// optional, default : true
        dismissable : true,							// optional, default : false
      // text displayed in the status bar when the notification (and the ticker) are updated
      ticker	  : 'Now playing "'+this.title+'"',
      //All icons default to their built-in android equivalents
      //The supplied drawable name, e.g. 'media_play', is the name of a drawable found under android/res/drawable* folders
      playIcon: 'media_play',
      pauseIcon: 'media_pause',
      prevIcon: 'media_prev',
      nextIcon: 'media_next',
      closeIcon: 'media_close',
      notificationIcon: 'notification'
    });
    CapacitorMusicControls.addListener('controlsNotification', (info: any) => {
      console.log('controlsNotification was fired');
      console.log(info);
      this.handleControlsEvent(info);
  });
    this.curr_playing_file = this.musicService.createMedia(this.play_The_track)
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
    
    // alert(3);
  }

  handleControlsEvent(action){

    console.log("hello from handleControlsEvent")
    const message = action.message;
  
    console.log("message: " + message)
  
    switch(message) {
      case 'music-controls-next':
        // next
        this.next();
        break;
      case 'music-controls-previous':
        // previous
        this.previous();
        break;
      case 'music-controls-pause':
        // paused
        this.pause();
        break;
      case 'music-controls-play':
        // resumed
        this.play();
        break;
      case 'music-controls-destroy':
        // this.stop();
        // this.setToPlayback();
        // this.ngOnInit();
        // controls were destroyed
        break;
  
      // External controls (iOS only)
      case 'music-controls-toggle-play-pause' :
        // do something
        break;
      case 'music-controls-seek-to':
        // do something
        break;
      case 'music-controls-skip-forward':
        // Do something
        break;
      case 'music-controls-skip-backward':
        // Do something
        break;
  
      // Headset events (Android only)
      // All media button events are listed below
      case 'music-controls-media-button' :
        // Do something
        break;
      case 'music-controls-headset-unplugged':
        // Do something
        break;
      case 'music-controls-headset-plugged':
        // Do something
        break;
      default:
        break;
    }
  
}
  async getAndSetCurrentAudioPosition() {
    // alert('gas');
    const diff = 1;
    const self = this;
    this.get_position_interval = setInterval( async() => {
      // tslint:disable-next-line: variable-name
      const last_position = self.position;
      self.curr_playing_file.getCurrentPosition().then(async (position) => {
        if (position >= 0 && position < self.duration) {
          if (Math.abs(last_position - position) >= diff) {
            // set position
            if(Number.isInteger(last_position)){
              self.curr_playing_file.seekTo(last_position * 1000);
            }else{
              self.position = position;
            this.display_position = this.toHHMMSS(self.position);
            }
            // alert(last_position);
            // self.position = position;
            // this.display_position = this.toHHMMSS(self.position);
          } else {
            // update position for display
            self.position = position;
            this.display_position = this.toHHMMSS(self.position);
            CapacitorMusicControls.updateIsPlaying({
              isPlaying: this.is_playing, // affects Android only
              elapsed:  this.toHHMMSS(self.position)// affects iOS Only
          });
          }
        } else if (position >= self.duration) {
          // last_position = 0;
          this.running = true;
          self.stop();
          self.setToPlayback();
          //  alert(4);
          if(!this.background){
            
              this.next();
            
          // this.next_interval =setInterval(()=>{
          //   if(this.display_position == '00:00'){
          //   clearInterval(this.next_interval);
          //   this.next();
          //   }
          // },100)
          
          }
         
        }else if(position < 1){
          this.running = false;
        }
      });
    }, 100);
  }

  play() {
    this.curr_playing_file.play();
  
  }

  pause() {
    this.curr_playing_file.pause();
  }

  stop() {
    this.curr_playing_file.stop();
    this.curr_playing_file.release();
    clearInterval(this.get_position_interval);
    this.position = 0;
    // this.display_position = "00:00";
  }

  controlSeconds(action) {
    const step = 5;
    const numberRange = this.position;
    switch (action) {
      case 'back':
        // alert(Math.ceil(numberRange));
        this.position = Math.floor(numberRange) < step ? 0.001 : numberRange - step;
        this.position = Math.floor(this.position);
        // alert(this.position);
        break;
      case 'forward':
        this.position =
        Math.ceil(numberRange) + step < this.duration
            ? Math.ceil(numberRange) + step
            : this.duration;
            this.position = Math.floor(this.position);
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

  // const file: MediaObject = this.media.create(this.play_The_track);
  public getStoredMusic() {
    return this.storage.getItem('lists').then((val) => {
      return val;
    });
  }

  next() {
    // alert(I)
    this.musicService.running = 'next';
    try {
      this.stop();
    } catch (error) {
      
    }
    this.route.paramMap.subscribe((params) => {
      if (!params.has('id')) {
        this.navCtrl.navigateBack('/home/tabs/libraries/music-list');
      }
      this.id = params.get('id');
      let next = parseInt(this.id) + 1;
      // alert(next);
      this.router.navigateByUrl('/home/tabs/libraries/music-list/music-detail/' + next);
      // alert(window.location.pathname);
    });
  }
  previous() {
    this.musicService.running = 'previous';
    alert(this.musicService.running);
    try {
      this.stop();
    } catch (error) {
      
    }
    
    this.route.paramMap.subscribe((params) => {
      if (!params.has('id')) {
        this.navCtrl.navigateBack('/home/tabs/libraries/music-list');
      }
      this.id = params.get('id');
      let previous = parseInt(this.id) - 1;
      // alert(previous);
      this.router.navigateByUrl('/home/tabs/libraries/music-list/music-detail/' + previous);
      // alert(window.location.pathname);
    });
  }

  async createDB() {
  await this.sqlite.create({
  name: 'obaorin.db',
  location: 'default'
})
    .then(async (db: SQLiteObject) => {
      // alert("HELLOWORLD");
    this.dbo = db;
    db.executeSql('create table  IF NOT EXISTS songlist(id INTEGER PRIMARY KEY,songs LONGTEXT)', [])
      .then(() => {
        // db.executeSql("INSERT INTO songlist VALUES ('[]')");
      }
        // alert('Executed SQL')
    ).catch(e =>{}
        // alert(JSON.stringify(e))
        );
  })
      // .catch(e => alert(JSON.stringify(e)));
  }

  async GetTable(id) {
    await this.dbo.executeSql('SELECT * FROM songlist where id = ?', [id]).then(async (response) => {
      // alert(id);
    // alert(JSON.stringify(response.rows.item(0).songs))
      // alert(response.rows.item(0).songs);
      this.data = response.rows.item(0).songs;
      // return response.rows.item(0).songs;
    }).catch(e =>{
      this.navCtrl.navigateBack('/home/tabs/libraries/music-list');
      // alert(e);
    }
        
        );
  }
}
