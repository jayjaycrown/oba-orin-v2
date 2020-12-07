import { Component, OnInit } from '@angular/core';
import { APIServiceService } from '../../service/apiservice.service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-libraries',
  templateUrl: './libraries.page.html',
  styleUrls: ['./libraries.page.scss'],
})
// tslint:disable-next-line: component-class-suffix
export class LibrariesPage implements OnInit {

  constructor(private apiService: APIServiceService, private platform: Platform) {
    // this.platform.ready().then(() => {
    //   // this.apiService.getImei().then(res => {
    //     // alert(res);
    //   });
    // });
  }

  ngOnInit() {
    
  }
  comingSoon() {
    // this.apiService.getImei().then(res => {
    //   alert(res);
    // });
    // alert('Coming Soon');
  }

}
