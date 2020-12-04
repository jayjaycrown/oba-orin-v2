import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-libraries',
  templateUrl: './libraries.page.html',
  styleUrls: ['./libraries.page.scss'],
})
// tslint:disable-next-line: component-class-suffix
export class LibrariesPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  comingSoon() {
    alert('Coming Soon');
  }

}
