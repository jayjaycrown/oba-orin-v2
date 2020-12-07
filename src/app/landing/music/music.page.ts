import { FcmService } from './../../services/fcm.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { MusicserviceService } from '../../home/music-list/musicservice.service';
import { APIServiceService } from '../../service/apiservice.service';
@Component({
  selector: 'app-music',
  templateUrl: './music.page.html',
  styleUrls: ['./music.page.scss'],
})
// tslint:disable-next-line: component-class-suffix
export class MusicPage implements OnInit {
  featuredList = [];
  downloadedList = [];
  @ViewChild('slideWithNav', { static: false }) slideWithNav: IonSlides;
  // @ViewChild('slideWithNav2', { static: false }) slideWithNav2: IonSlides;
  // @ViewChild('slideWithNav3', { static: false }) slideWithNav3: IonSlides;

  test;
  banners = [];
  sliderOne: any;
  sliderTwo: any;
  sliderThree: any;
  slideOptsOne = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: true
  };
  type: string;
  constructor(private router: Router, private api: APIServiceService,
    public loadingCtrl: LoadingController,private fcm: FcmService) {
      this.sliderOne =
    {
      isBeginningSlide: true,
      isEndSlide: false,
      slidesItems: 
      [
      
        {
          img: 'https://i.pinimg.com/originals/00/c8/31/00c83102018887703d987f2917d494af.jpg'
        },
        // {
        //   img: 'assets/img/preview.png'
        // }
      ]
    };

  }

   // Move to Next slide
  slideNext(object, slideView) {
    slideView.slideNext(500).then(() => {
      this.checkIfNavDisabled(object, slideView);
    });
  }

  // Move to previous slide
  slidePrev(object, slideView) {
    slideView.slidePrev(500).then(() => {
      this.checkIfNavDisabled(object, slideView);
    });
  }

  // Method called when slide is changed by drag or navigation
  SlideDidChange(object, slideView) {
    this.checkIfNavDisabled(object, slideView);
  }

  // Call methods to check if slide is first or last to enable disbale navigation
  checkIfNavDisabled(object, slideView) {
    this.checkisBeginning(object, slideView);
    this.checkisEnd(object, slideView);
  }

  checkisBeginning(object, slideView) {
    slideView.isBeginning().then((istrue) => {
      object.isBeginningSlide = istrue;
    });
  }
  checkisEnd(object, slideView) {
    slideView.isEnd().then((istrue) => {
      object.isEndSlide = istrue;
    });
  }

  async ngOnInit() {
    // alert('init');
    // alert(JSON.stringify(this.api.app_data));
    // this.api.app_data.notification_id = '';
    if(this.api.app_data === undefined || this.api.app_data.notification_id == ''){
      // alert(1);
      this.fcm.initPush();
    }
    await (await this.api.getBanners()).toPromise().then(async (res:any)=>{
      // alert(JSON.stringify(res));
      let banners = JSON.parse(res);
    // alert(JSON.stringify(this.musicList));
    const status = banners.status;
    if (status === 'failed') {
      alert('Status Failed');
    }
    banners = banners.result;
    // alert(banners)
    // alert(JSON.stringify(banners));
    for (const item of banners) {
      // alert(1);
      this.banners.push({
        bid: item.id,
        img: item.image_url,
        url: item.link,
        type: 'banner',
        id: window.btoa(encodeURIComponent(item.bid) + '~' + item.link + '~' + item.type + '~' + item.image_url)
      });
      // alert(item.title + '~' + item.url + '~' + item.type);
    }
    // alert(JSON.stringify(this.banners));
    this.sliderOne =
    {
      isBeginningSlide: true,
      isEndSlide: false,
      slidesItems: this.banners
      // [
      
        // {
        //   img: 'assets/img/ous_system.png'
        // },
        // {
        //   img: 'assets/img/preview.png'
        // }
      // ]
    };
    console.log(this.sliderOne);
  }, async err => {
      alert(err);
     
  });
    this.type = 'featured';
    // alert(2);
    this.fetchFeatured();
    this.fetchMostDownloaded();
  }

// alert(1);
  async fetchFeatured(){
    // alert(1);
    const loading = this.loadingCtrl.create({
      keyboardClose: true,
      message: `
                <div class="custom-spinner-container">
                  <div class="custom-spinner-box"></div>
                </div>`
    });
    this.api.getFeatured().subscribe(async (res:any)=>{
      let featuredList = JSON.parse(res);
    // alert(JSON.stringify(this.musicList));
    const status = featuredList.status;
    if (status === 'failed') {
      alert('Status Failed');
    }
    featuredList = featuredList.result;
    for (const item of featuredList) {
      // alert(JSON.stringify(item));
      this.featuredList.push({
        title: item.name,
        tag: item.file_id,
        url: item.url,
        no_downloads: item.no_downloads,
        type: 'featured',
        id: window.btoa(encodeURIComponent(item.name) + '~' + item.url + '~' + item.type + '~' + item.tag+'~'+'featured')
      });
      // alert(item.title + '~' + item.url + '~' + item.type);
    }
    (await loading).dismiss();
  }, async err => {
    (await loading).dismiss();
      alert(err);
     
  });
    
  }

  async fetchMostDownloaded(){
    const loading = this.loadingCtrl.create({
      keyboardClose: true,
      message: `
                <div class="custom-spinner-container">
                  <div class="custom-spinner-box"></div>
                </div>`
    });
    this.api.getMostDownloaded().subscribe(async (res:any)=>{
      let downloadedList = JSON.parse(res);
    // alert(JSON.stringify(this.musicList));
    const status = downloadedList.status;
    if (status === 'failed') {
      alert('Status Failed');
    }
    downloadedList = downloadedList.result;
    for (const item of downloadedList) {
      this.downloadedList.push({
        title: item.name.substr(0, 30),
        tag: item.file_id,
        url: item.url,
        no_downloads: item.no_downloads,
        type: 'featured',
        id: window.btoa(encodeURIComponent(item.name) + '~' + item.url + '~' + item.type + '~' + item.tag+'~'+'most_downloaded')
      });
      // alert(item.title + '~' + item.url + '~' + item.type);
    }
    (await loading).dismiss();
  }, async err => {
    (await loading).dismiss();
      alert(err);
     
  });
    
  }
  segmentChanged(ev: any) {
    console.log('Segment changed', ev);
  }

  search(event) {
    console.log(this.test);
    this.router.navigateByUrl('/home/tabs/music/music-lists/'+this.test);
  }

}
