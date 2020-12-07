import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-lyrics',
  templateUrl: './lyrics.page.html',
  styleUrls: ['./lyrics.page.scss'],
})
export class LyricsPage implements OnInit {
  lists = [];
  slist: any;
  loadering: any;
  dbo: any;
  rowsCount: any;
  count = 0;
  constructor(
              private sqlite: SQLite,
              private sqlitePorter: SQLitePorter,
              private platform: Platform,
              private loader: LoadingController,
              private file: File,
  ) {
    this.platform.ready().then(async () => {
     
    }).catch(error => {
      console.log(error);
    });
  }
  async getAllLyrics() {
    // this.DropTable('lyricslist');
    // tslint:disable-next-line: align
    // await this.dbo.executeSql("INSERT INTO lyricslist VALUES ('123')") .then(() => alert('INSERT SQL'))
    //   .catch(e => alert(JSON.stringify(e)));
    // tslint:disable-next-line: align
    await this.dbo.executeSql('SELECT * FROM lyricslist', []).then(async (response) => {
      this.rowsCount = response.rows.length;
      // alert(this.rowsCount);
      // if (this.rowsCount === 0) {
      //    this.dbo.executeSql("INSERT INTO lyricslist VALUES ('[]')",[]);
      // }
      // alert(JSON.stringify( response.rows.item(2).lyrics));
      if (response.rows.length > 0) {
        for (let i = 0; i < response.rows.length; i++) {
          // alert(response.rows.item(i).lyrics);
          this.lists.push({
            name: response.rows.item(i).name,
            lyrics: response.rows.item(i).lyrics,
            id: response.rows.item(i).id,
          });
        }
      } else {
          alert('No Lyrics Available');
      }
      // alert(JSON.stringify(response));
    }) .catch(e =>{}
      //  alert(JSON.stringify(e))
       
       );

  }

  async doRefresh(event) {
    this.lists = [];
    this.count = 0;
    // await this.getAllMusic();
      event.target.complete();
      // location.reload();

  }
  async ngOnInit() {
    // alert(1);
   await this.createDB();
    this.loader.create({
      keyboardClose: true,
      message: `
                <div class="custom-spinner-container">
                  <div class="custom-spinner-box"></div>
                </div>`
    }).then(async loadingEl => {
      this.loadering = loadingEl;
      loadingEl.present();
      await this.getAllLyrics();
      // await this.getAllMusic();
      loadingEl.dismiss();
    });

  }


async createDB() {
  await this.sqlite.create({
  name: 'obaorin.db',
  location: 'default'
})
  .then(async (db: SQLiteObject) => {
    this.dbo = db;
    db.executeSql('create table  IF NOT EXISTS lyricslist (id INTEGER PRIMARY KEY,lyrics LONGTEXT, name TEXT)', [])
      .then(() => {
        // db.executeSql("INSERT INTO lyricslist VALUES ('[]')");
      }
        // alert('Executed SQL')
    ).catch(e =>{}
        // alert(JSON.stringify(e))
        );
  })
      .catch(e => alert(JSON.stringify(e)));
  }

async DropTable(tableName) {
    this.dbo.executeSql('DROP table ' + tableName, []).then(() => {}
        // alert('Executed SQL')
    ).catch(e => {}
        // alert(JSON.stringify(e))
        );
  }

async UpdateTable(value) {
  await this.dbo.executeSql('UPDATE lyricslist set lyrics = ?', [value]).then(() => {
      // alert('Executed SQL');
    }

  ).catch(e => {
      // alert(JSON.stringify(e));
    }

        );
  }
async GetTable(tableName) {
  await this.dbo.executeSql('SELECT * FROM lyricslist', []).then(async (response) => {
    // alert(JSON.stringify(response.rows.item(0).lyrics))
      this.slist = JSON.parse(response.rows.item(0).lyrics);
    });
}
  
async DeleteTable(tableName) {
  await this.dbo.executeSql('DELETE FROM lyricslist where id != ?', ['0']).then(async (response) => {
    // alert(JSON.stringify(response.rows.item(0).lyrics))
    // alert(JSON.stringify(response));
      // this.slist = JSON.parse(response.rows.item(0).lyrics);
    });
  }

  async InsertOrUpdate(id, song) {
    await this.dbo.executeSql("INSERT OR REPLACE INTO lyricslist VALUES(?,?)",[id,song]).then(async (response) => {
    // alert(JSON.stringify(response.rows.item(0).lyrics))
      // this.slist = JSON.parse(response.rows.item(0).lyrics);
      // alert('IOU'+JSON.stringify(response))
    }).catch(e => {
      // alert(JSON.stringify(e))
    }
        // alert(JSON.stringify(e))
        );
}
}
