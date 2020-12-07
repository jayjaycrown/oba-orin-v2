import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MediaObject, Media } from '@ionic-native/media/ngx';
import { Platform, LoadingController, NavController } from '@ionic/angular';

import { HTTP } from '@ionic-native/http/ngx';
import { MusicserviceService } from '../../../../home/music-list/musicservice.service';
import { APIServiceService } from '../../../../service/apiservice.service';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';

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
  nd = -1;
  previousMusicId: any;
  // musicLists: Music[];
  title: any;
  artist: any;
  image = 'assets/img/obaorin.jpg';
  filename: any = 'Test Music';
  duration: any = -1;
  data: any;
  loading: any;
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
  previous;
  error = false;
  dbo: any;
  musicList: any;
  background;
  constructor(
    private api: APIServiceService,
    public loadingCtrl: LoadingController,
    private musicService: MusicserviceService,
    private route: ActivatedRoute,
    private router: Router,
    private media: Media,
    private platform: Platform,
    private transfer: FileTransfer,
    private file: File,
    private http: HTTP,
    private backgroundMode: BackgroundMode

  ) { }

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
    this.route.paramMap.subscribe(async (params) => {
      if (!params.has('id')) {
        this.router.navigate(['/home/tabs/music']);
      }
      this.id = params.get('id');
      let str;
      str = window.atob(this.id);
      //  alert(str);
      str = str.split('~');
      await this.getMusicDetails(str[0], str[3], str[1], str[2]);
      this.previous = str[4];
      
      // alert(this.play_The_track);
      this.title = decodeURIComponent(str[0]);
      // await this.prepareAudioFile();
      
    });

  }

  back(){
    if(this.previous == 'featured' || this.previous == 'most_downloaded'){
      this.router.navigateByUrl('/home/tabs/music')
    }else{
      this.router.navigateByUrl('/home/tabs/music/music-lists/'+this.previous);
    }
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
      if(this.musicDetails.status == 'nosub'){
        alert("You Do not have an active subscription. Kindly subscribe");
        if(this.previous == 'featured' || this.previous == 'most_downloaded'){
          this.router.navigateByUrl('/home/tabs/music')
        }else{
          this.router.navigateByUrl('/home/tabs/music/music-lists/'+this.previous);
        }
        // this.lyricsContent = "You Do not have an active subscription. Kindly subscribe";
      }else if(this.musicDetails.status != 'success'){
        alert('An error occured, try again');
        if(this.previous == 'featured' || this.previous == 'most_downloaded'){
          this.router.navigateByUrl('/home/tabs/music')
        }else{
          this.router.navigateByUrl('/home/tabs/music/music-lists/'+this.previous);
        }
        // this.lyricsContent = this.lyricsDetails.message;
      }else{
        
      }
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

  async downloadDoc() {  
      // alert(this.file.externalRootDirectory)
      await this.file.checkDir(this.file.externalRootDirectory,"obaorin").then(()=>{

      },async (err) =>{
        await this.file.createDir(this.file.externalRootDirectory, 'obaorin', false).then(() =>{

        });
      });
      await this.file.createDir(this.file.externalRootDirectory+"/obaorin", 'downloads', false).then(response => {  
    }).catch(err => {
      // alert(JSON.stringify(err));
      // console.log('Could not create directory "my_downloads" ',err);
    }); 
    alert("Download Started");
      const loading = this.loadingCtrl.create({
        keyboardClose: true,
        message: `
                  <div class="custom-spinner-container">
                    <div class="custom-spinner-box"></div>
                  </div>`
      });
  
      (await loading).present();
    let sn = this.title.replace("/","-");
    // sn.replace()
    this.http.downloadFile(this.play_The_track,"","",this.file.externalRootDirectory + 'obaorin/downloads/' + encodeURIComponent(sn) + '.mp3').then(async (entry)=>{
      // console.log(entry.name);
      (await loading).dismiss();
        alert("Music Downloaded");
      // prints the filePath
      console.log(entry.fullPath);
    },async (err) =>{
      (await loading).dismiss();
      alert(JSON.stringify(err));
      // console.error(response.error);
    });
    // console.log('Directory created',response);
      // const fileTransfer = this.transfer.create();
      
      // // alert(this.play_The_track);
      // fileTransfer.download(this.play_The_track,this.file.externalRootDirectory + 'obaorin/downloads/' + this.title + '.mp3').then(async (entry) => {
      //   console.log('file download response',entry);
      //   (await loading).dismiss();
      //   alert("Music Downloaded");

      // })
      // .catch(async (err) =>{
      //   (await loading).dismiss();
      //   alert(JSON.stringify(err));
      //   console.log('error in file download',err);
      // });
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
            if(Number.isInteger(last_position)){
              self.curr_playing_file.seekTo(last_position * 1000);
            }else{
              self.position = position;
            this.display_position = this.toHHMMSS(self.position);
            }
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

  async play() {
    this.curr_playing_file.play();
    // this.duration = -1;
    let temp_duration = -1;
    if(this.nd === -1){
      this.loading = this.loadingCtrl.create({
        keyboardClose: true,
        message: `
                  <div class="custom-spinner-container">
                    <div class="custom-spinner-box"></div>
                  </div>`
      });
  
      (await this.loading).present();
    }
    this.get_duration_interval = setInterval(async () => {
      if (this.nd === -1 || !this.nd) {
        // tslint:disable-next-line: no-bitwise
        this.nd = ~~this.curr_playing_file.getDuration(); // make it an integer
        // alert(JSON.stringify(this.curr_playing_file.getDuration()));
      } else {
        if (this.nd !== temp_duration) {
          (await this.loading).dismiss();
          temp_duration = this.nd;
          this.duration = temp_duration;
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

}
