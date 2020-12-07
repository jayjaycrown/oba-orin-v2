import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { APIServiceService } from '../../service/apiservice.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  reg = {
    name: '',
    email: '',
    phone: '',
    password: ''
  };
  constructor(private api: APIServiceService, private router: Router, private loadingCtrl: LoadingController) { }

  ngOnInit() {
  }

  
  async registerForm(form: NgForm) {
    const loading = this.loadingCtrl.create({
      keyboardClose: true,
      message: `
                <div class="custom-spinner-container">
                  <div class="custom-spinner-box"></div>
                </div>`
    });

    (await loading).present();
    // console.log(form.value)
    await this.api.register(form.value).subscribe(async res=>{
      // alert(res);
      let response = res;
      if(response.status == 'success'){
        this.reg = {
          name: '',
        email: '',
        phone: '',
        password: ''
        };
        (await loading).dismiss();
        alert("Registration Successful");
        this.router.navigateByUrl('/login')
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
