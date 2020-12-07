import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MediaObject, Media } from '@ionic-native/media/ngx';
import { Platform, LoadingController, NavController } from '@ionic/angular';
// import { Music } from '../music.model';
// import { MusicserviceService } from '../musicservice.service';
import { Storage } from '@ionic/storage';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';

@Component({
  selector: 'app-lyrics-detail',
  templateUrl: './lyrics-detail.page.html',
  styleUrls: ['./lyrics-detail.page.scss'],
})
export class LyricsDetailPage implements OnInit {

  nextMusicId: any;
  previousMusicId: any;
  // musicLists: Music[];
  name: any;
  lyrics: any;
  data: any;
  id: any;
  dbo: any;
  constructor(
    public platform: Platform,
    private media: Media,
    // private musicService: MusicserviceService,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private storage: NativeStorage,
    private router: Router,
    private sqlite: SQLite,
    private sqlitePorter: SQLitePorter,
  ) {
    this.platform.ready().then(() => {
      // this.createDB();
    }).catch(error => {
      // console.log(error);
    });
  }

  async ngOnInit() {
    // alert(this.musicList);
    await this.createDB();
    this.route.paramMap.subscribe(async (params) => {
      if (!params.has('id')) {
        this.router.navigate(['/home/tabs/libraries/lyrics']);
      }
      this.id = params.get('id');
      await this.GetTable(this.id);
    });

  }




  async createDB() {
  await this.sqlite.create({
  name: 'obaorin.db',
  location: 'default'
})
    .then(async (db: SQLiteObject) => {
      // alert("HELLOWORLD");
    this.dbo = db;
    db.executeSql('create table  IF NOT EXISTS lyricslist (id INTEGER PRIMARY KEY,lyrics LONGTEXT, name TEXT)', [])
      .then(() => {
        // db.executeSql("INSERT INTO songlist VALUES ('[]')");
      }
        // alert('Executed SQL')
    ).catch(e =>{}
        // alert(JSON.stringify(e))
        );
  })
      .catch(e => alert(JSON.stringify(e)));
  }

  async GetTable(id) {
    await this.dbo.executeSql('SELECT * FROM lyricslist where id = ?', [id]).then(async (response) => {
      // alert(id);
    // alert(JSON.stringify(response.rows.item(0).songs))
      // alert(response.rows.item(0).songs);
      this.name = response.rows.item(0).name;
      this.lyrics = response.rows.item(0).lyrics;
      // return response.rows.item(0).songs;
    }).catch(e =>{}
        // alert(JSON.stringify(e))
        );
  }

}
