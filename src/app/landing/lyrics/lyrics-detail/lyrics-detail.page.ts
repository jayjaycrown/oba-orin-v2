import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { Platform } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { APIServiceService } from '../../../service/apiservice.service';

@Component({
  selector: 'app-lyrics-detail',
  templateUrl: './lyrics-detail.page.html',
  styleUrls: ['./lyrics-detail.page.scss'],
})
// tslint:disable-next-line: component-class-suffix
export class LyricsDetailPage implements OnInit {
dbo: any;
slist: any;
loadering: any;
rowsCount: any;
count = 0;
id: any;
lyricsContent;
lyricsTitle;
  lyricsDetails: any;
  constructor(
    private sqlite: SQLite,
    private sqlitePorter: SQLitePorter,
    private platform: Platform,
    private route: ActivatedRoute,
    private router: Router,
    private api: APIServiceService,
    public loadingCtrl: LoadingController
  ) {
    this.platform.ready().then(async () => {
    }).catch(error => {
      console.log(error);
    });
  }

  async ngOnInit() {
    // alert(1);

     await this.createDB();
    //  this.DropTable('lyricslist');
     this.route.paramMap.subscribe(async (params) => {
      if (!params.has('id')) {
        this.router.navigate(['/home/tabs/lyrics']);
      }
      this.id = params.get('id');
      let str;
      str = window.atob(this.id);
      //  alert(str);
      str = str.split('~');
      //  alert( 'from mdetsil')
      // alert(encodeURIComponent(str[0]));

      this.getLyrics(str[0] , str[2], str[1]);
      this.lyricsTitle = decodeURIComponent(str[0]);

    });
     this.lyricsContent = '';
  }

   async getLyrics(title, type, url) {
    // alert('calling API');
     const loading = this.loadingCtrl.create({
      keyboardClose: true,
      message: `
                <div class="custom-spinner-container">
                  <div class="custom-spinner-box"></div>
                </div>`
    });

     (await loading).present();
     await this.api.getLyricsDetails(title, type, url).subscribe(async (res: any) => {
      // alert(res);
      this.lyricsDetails = JSON.parse(res);
      if(this.lyricsDetails.status == 'nosub'){
        alert("You Do not have an active subscription. Kindly subscribe");
        this.lyricsContent = "You Do not have an active subscription. Kindly subscribe";
      }else if(this.lyricsDetails.status != 'success'){
        alert('An error occured, try again');
        this.lyricsContent = this.lyricsDetails.message;
      }else{
        this.lyricsDetails = this.lyricsDetails.result;
      this.lyricsContent = this.lyricsDetails.content;
      }
      
      (await loading).dismiss();
    }, async err => {
      (await loading).dismiss();
      alert(err);
    });
  }

  async saveLyrics(){
    if(this.lyricsDetails.status == 'nosub'){

      alert('Be Calming Down. Please Subscribe');
      return;
    }
    await this.dbo.executeSql('SELECT * FROM lyricslist where id = ? ', [this.id]).then(async (response) => {
      if (response.rows.length >= 1){
        alert('Lyrics already Saved');
      }else{
        await this.InsertOrUpdate(this.id, this.lyricsContent, this.lyricsTitle);
        alert('Lyrics Saved Successfully');
      }
      // alert(JSON.stringify(response.rows.item(0).lyrics))
        // return response;
      });



    // alert(lyricsContent);

  }

  async createDB() {
    await this.sqlite.create({
    name: 'obaorin.db',
    location: 'default'
  })
    .then(async (db: SQLiteObject) => {
      this.dbo = db;
      db.executeSql('create table  IF NOT EXISTS lyricslist(id TEXT,lyrics LONGTEXT, name TEXT)', [])
        .then(() => {
          // db.executeSql("INSERT INTO lyricslist VALUES ('[]')");
        }
          // alert('Executed SQL')
      ).catch(e =>
          alert(JSON.stringify(e))
          );
    })
        .catch(e => alert(JSON.stringify(e)));
    }

  async DropTable(tableName) {
      this.dbo.executeSql('DROP table ' + tableName, []).then(() => {alert('Executed SQL'); }

      ).catch(e => {}
          // alert(JSON.stringify(e))
          );
    }

  async UpdateTable(value) {
    await this.dbo.executeSql('UPDATE lyricslist set lyrics = ?', [value]).then(() => {
        alert('Executed SQL');
      }

    ).catch(e => {
        alert(JSON.stringify(e));
      }

          );
    }
  async GetTable(tableName) {
    await this.dbo.executeSql('SELECT * FROM lyricslist', []).then(async (response) => {
      // alert(JSON.stringify(response.rows.item(0).lyrics))
        this.slist = JSON.parse(response.rows.item(0).lyrics);
      });
  }
  // async GetCount() {
  //   await this.dbo.executeSql('SELECT * FROM lyricslist', []).then(async (response) => {
  //     // alert(JSON.stringify(response.rows.item(0).lyrics))
  //       return response;
  //     });
  // }

  async DeleteTable(tableName) {
    await this.dbo.executeSql('DELETE FROM lyricslist where id != ?', ['0']).then(async (response) => {
      // alert(JSON.stringify(response.rows.item(0).lyrics))
      // alert(JSON.stringify(response));
        // this.slist = JSON.parse(response.rows.item(0).lyrics);
      });
    }

    async InsertOrUpdate(id, lyrics, lyricsTitle) {
      await this.dbo.executeSql('INSERT OR REPLACE INTO lyricslist VALUES(?,?,?)', [id, lyrics, lyricsTitle]).then(async (response) => {
      // alert(JSON.stringify(response.rows.item(0).lyrics))
        // this.slist = JSON.parse(response.rows.item(0).lyrics);
        // alert('IOU'+JSON.stringify(response))
      }).catch(e => {
        alert(JSON.stringify(e));
      }
          // alert(JSON.stringify(e))
          );
  }

  }



