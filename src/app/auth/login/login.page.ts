import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { APIServiceService } from '../../service/apiservice.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Platform, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
// tslint:disable-next-line: component-class-suffix
export class LoginPage implements OnInit {
  login = {
    username: '',
    password: ''
  };
  constructor(private api: APIServiceService, private router: Router,private storage: NativeStorage,private platform: Platform,private loadingCtrl: LoadingController) { }

  register() { }
  forgotPass() { }
  // login() { }
  ngOnInit() {
    this.platform.ready().then(() => {
      // setTimeout(() => {
      //   // alert(1);
      //   // alert(this.display_duration);
      //   // alert(this.api.app_data)
      // if(this.api.app_data.api_token !== null){
      //   this.router.navigateByUrl('/home/tabs')
      // }
      // }, 1000);
      
      // this.getImei();
    });

    

  }

  ionViewWillEnter(){
    // setTimeout(() => {
      // alert(1);
      // alert(this.display_duration);
      // alert(this.api.app_data)
    if(this.api.app_data.api_token !== null){
      this.router.navigateByUrl('/home/tabs')
    }
    // }, 10);
  }

  async LoginForm(form: NgForm) {
    // alert(1);
    // console.log(form.value)
    const loading = this.loadingCtrl.create({
      keyboardClose: true,
      message: `
                <div class="custom-spinner-container">
                  <div class="custom-spinner-box"></div>
                </div>`
    });

    (await loading).present();
    await this.api.login(form.value).subscribe(async res=>{
      // alert(res);
      let response = res;
      if(response.status == 'success'){
        this.login = {
          username: '',
           password: ''
        };
        await this.storage.setItem('app_data', res.result);
        await this.storage.getItem('app_data').then((lists) => {
          this.api.app_data = lists;
            //  alert(JSON.stringify(lists));
      
          });
        alert("Login Successful");
        (await loading).dismiss();
        
        
    //    this.storage.getItem('app_data').then((lists) => {
    //    alert(JSON.stringify(lists));

    // });
        this.router.navigateByUrl('/home/tabs')
      }else{
        (await loading).dismiss();
        alert("Error=> "+res.message);
      }
      // alert(res);
    },async err=>{
      (await loading).dismiss();
      alert(err);
    })
  }

}
