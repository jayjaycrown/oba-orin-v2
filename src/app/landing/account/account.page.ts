import { async } from '@angular/core/testing';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { LoadingController, Platform } from '@ionic/angular';
import { APIServiceService } from './../../service/apiservice.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  details ;
  subscribe;
  name;
  email;
  phone;
  account_number;
  subscription_expiry;
  subscribeText = "Active";
  constructor( private api: APIServiceService, private platform: Platform, private storage: NativeStorage,private loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.platform.ready().then(() => {
      //  this.storage.remove('app_data');
      setTimeout(async () => {
        await this.api.checkLoggedIn();
        if(this.api.app_data.account_number == ''){
          // alert(1);
          this.subscribe = true;
        }
    // alert(this.api.app_data.account_number);
        if(this.api.app_data.account_number != ''){
          this.details = true;
          this.account_number = this.api.app_data.account_number;
        }
        this.name = this.api.app_data.name;
        this.email = this.api.app_data.email;
        this.phone = this.api.app_data.phone_number;
        this.subscription_expiry = this.api.app_data.subscription_expiry;
        if(this.subscription_expiry == ''){
          this.subscribeText = "No Active Subscription";
        }
      }, 1000);
      
      // this.getImei();
    });

   

  }

  async logout(){
    await this.api.logout();

  }
  async generateAccount(){
    // alert("Generating Account, Please Wait");
    const loading = this.loadingCtrl.create({
      keyboardClose: true,
      message: `
                <div class="custom-spinner-container">
                  <div class="custom-spinner-box"></div>
                </div>`
    });

    (await loading).present();
    this.api.generateAccount().subscribe(async(res:any) =>{
      // alert(res);
      res = JSON.parse(res);
      if(res.status == 'success'){
        (await loading).dismiss();
        this.details = true;
        this.subscribe = false;
        this.account_number = res.result;
        this.api.app_data.account_number = res.result;
        this.updateDetails();
      }else{
        (await loading).dismiss();
        alert('An error occured, Please try again.');
      }
    });
  }

  async doRefresh(event) {
    await this.updateDetails();
    event.target.complete();
      // location.reload();

  }

  async updateDetails(){
    
    await this.api.getDetails().toPromise().then(async (res:any) =>{
      // alert(res);
      res = JSON.parse(res);
      if(res.status == 'success'){
        await this.storage.setItem('app_data', res.result);
        if(res.result.subscription_expiry == ''){
            this.subscribeText = "No Active Subscription";
            this.subscription_expiry = '';
        }else{
            this.subscribeText = "Active Subscription Ends On";
            this.subscription_expiry = res.result.subscription_expiry;
        }
        // location.reload();
      }else{
        alert('An error occured, Please try again.');
      }
    });

  }

}
