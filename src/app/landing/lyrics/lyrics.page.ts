import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { APIServiceService } from '../../service/apiservice.service';

@Component({
  selector: 'app-lyrics',
  templateUrl: './lyrics.page.html',
  styleUrls: ['./lyrics.page.scss'],
})
// tslint:disable-next-line: component-class-suffix
export class LyricsPage implements OnInit {

  test: any;
  type: string;
  lyricsList;
  list = [];
  constructor(private apiService: APIServiceService, public loadingCtrl: LoadingController) {}

  ngOnInit() {
    this.type = 'featured';
  }
  segmentChanged(ev: any) {
    console.log('Segment changed', ev);
  }

  async search(event) {
    // this.test = encodeURIComponent(this.test);
    // alert(this.test);
    this.list = [];
    const loading = this.loadingCtrl.create({
      keyboardClose: true,
      message: `
                <div class="custom-spinner-container">
                  <div class="custom-spinner-box"></div>
                </div>`
    });

    (await loading).present();
    // console.log(this.test);
    this.apiService.getSearchLyrics(this.test).subscribe(async (res: any) => {
      this.lyricsList = JSON.parse(res);
      const status = this.lyricsList.status;
      if (status === 'failed') {
        alert('Status Failed');
      }
      this.lyricsList = this.lyricsList.result;
      this.test = '';

      for (const item of this.lyricsList) {
        this.list.push({
          title: item.title,
          url: item.url,
          type: item.type,
          id: window.btoa(encodeURIComponent(item.title) + '~' + item.url + '~' + item.type)
        });
        // alert(item.title + '~' + item.url + '~' + item.type);
      }

      // alert(this.lyricsList);
      // alert(JSON.stringify(this.lyricsList));
      (await loading).dismiss();
    }, async err => {
        alert(err);
        this.test = '';
        (await loading).dismiss();
    });
    // this.router.navigateByUrl('/home/tabs/music/music-lists');
  }

  async getLyrics(title, type, url) {
    const loading = this.loadingCtrl.create({
      keyboardClose: true,
      message: `
                <div class="custom-spinner-container">
                  <div class="custom-spinner-box"></div>
                </div>`
    });

    (await loading).present();
    this.apiService.getLyricsDetails(title, type, url).subscribe(async (res: any) => {
      (await loading).dismiss();
    }, async err => {
        (await loading).dismiss();
    });
  }

}
