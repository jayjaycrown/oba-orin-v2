import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lyrics',
  templateUrl: './lyrics.page.html',
  styleUrls: ['./lyrics.page.scss'],
})
// tslint:disable-next-line: component-class-suffix
export class LyricsPage implements OnInit {

  test: any;
  type: string;
  constructor() {}

  ngOnInit() {
    this.type = 'featured';
  }
  segmentChanged(ev: any) {
    console.log('Segment changed', ev);
  }

  search(event) {
    console.log(this.test);
    // this.router.navigateByUrl('/home/tabs/music/music-lists');
  }

}
