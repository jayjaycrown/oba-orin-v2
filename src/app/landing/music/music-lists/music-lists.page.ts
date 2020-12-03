import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-music-lists',
  templateUrl: './music-lists.page.html',
  styleUrls: ['./music-lists.page.scss'],
})
// tslint:disable-next-line: component-class-suffix
export class MusicListsPage implements OnInit {

  test;
  constructor(private router: Router) { }

  ngOnInit() {
  }

  search(event) {
    console.log(this.test);
    // this.router.navigateByUrl('/home/tabs/music/music-lists')
  }
}
