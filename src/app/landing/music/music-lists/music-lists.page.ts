import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { MusicserviceService } from '../../../home/music-list/musicservice.service';
import { APIServiceService } from '../../../service/apiservice.service';

@Component({
  selector: 'app-music-lists',
  templateUrl: './music-lists.page.html',
  styleUrls: ['./music-lists.page.scss'],
})
// tslint:disable-next-line: component-class-suffix
export class MusicListsPage implements OnInit {

  test;
  musicList;
  list = [];
  constructor(
    private router: Router,
    private api: APIServiceService,
    public loadingCtrl: LoadingController,
    private musicService: MusicserviceService
  )
  { }

  ngOnInit() {
  }

  async search(event) {
    const loading = this.loadingCtrl.create({
      keyboardClose: true,
      message: `
                <div class="custom-spinner-container">
                  <div class="custom-spinner-box"></div>
                </div>`
    });

    (await loading).present();
    console.log(this.test);
    this.list = [];
    this.api.getSearchMusic(this.test).subscribe(async (res: any) => {
      this.musicList = JSON.parse(res);
      // alert(JSON.stringify(this.musicList));
      const status = this.musicList.status;
      if (status === 'failed') {
        alert('Status Failed');
      }
      this.musicList = this.musicList.result;
      this.test = '';

      for (const item of this.musicList) {
        this.list.push({
          title: item.title,
          tag: item.tag,
          url: item.url,
          type: item.type,
          id: window.btoa(encodeURIComponent(item.title) + '~' + item.url + '~' + item.type + '~' + item.tag)
        });
        // alert(item.title + '~' + item.url + '~' + item.type);
      }
      (await loading).dismiss();
    }, async err => {
        alert(err);
        this.test = '';
        (await loading).dismiss();
    });
    // this.router.navigateByUrl('/home/tabs/music/music-lists')
  }
}
