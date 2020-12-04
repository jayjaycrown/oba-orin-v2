import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { Platform } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-lyrics-detail',
  templateUrl: './lyrics-detail.page.html',
  styleUrls: ['./lyrics-detail.page.scss'],
})
export class LyricsDetailPage implements OnInit {
dbo : any;
slist: any;
loadering: any;
rowsCount: any;
count = 0;
id: any;
lyricsContent;
lyricsTitle;
  constructor(
    private sqlite: SQLite,
              private sqlitePorter: SQLitePorter,
              private platform: Platform,
              private route: ActivatedRoute,
              private router: Router
  ) { 
    this.platform.ready().then(async () => {
    }).catch(error => {
      console.log(error);
    });
  }

  async ngOnInit() {
    // alert(1);
     this.createDB();
    this.route.paramMap.subscribe(async (params) => {
      if (!params.has('id')) {
        this.router.navigate(['/home/tabs/lyrics']);
      }
      this.id = params.get('id');
    });
   //MakeApiCall
  //  document.getElementById()
  this.lyricsContent = 'ffffffffffff';
  this.lyricsTitle = "Lyrics Title";
  
   

    
  }

  async saveLyrics(){
    await this.dbo.executeSql('SELECT * FROM lyricslist where id = ? ', [this.id]).then(async (response) => {
      if(response.rows.length >= 1){
        alert('Lyrics already Saved');
      }else{
        await this.InsertOrUpdate(this.id, this.lyricsContent,this.lyricsTitle);
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
      db.executeSql('create table  IF NOT EXISTS lyricslist(id INTEGER PRIMARY KEY,lyrics LONGTEXT, name TEXT)', [])
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
      this.dbo.executeSql('DROP table ' + tableName, []).then(() => {}
          // alert('Executed SQL')
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
  
    async InsertOrUpdate(id, lyrics,lyricsTitle) {
      await this.dbo.executeSql("INSERT OR REPLACE INTO lyricslist VALUES(?,?,?)",[id,lyrics,lyricsTitle]).then(async (response) => {
      // alert(JSON.stringify(response.rows.item(0).lyrics))
        // this.slist = JSON.parse(response.rows.item(0).lyrics);
        // alert('IOU'+JSON.stringify(response))
      }).catch(e => {
        alert(JSON.stringify(e))
      }
          // alert(JSON.stringify(e))
          );
  }
  
  }
  


