import { Component, OnInit } from '@angular/core';

import { File } from '@ionic-native/file/ngx';
import { LoadingController } from '@ionic/angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-downloads',
  templateUrl: './downloads.page.html',
  styleUrls: ['./downloads.page.scss'],
})
// tslint:disable-next-line: component-class-suffix
export class DownloadsPage implements OnInit {

  lists = [];
  slist: any;
  loadering: any;
  dbo: any;
  rowsCount: any;
  count = 0;
  constructor(private file: File,
              private loader: LoadingController,
              private sqlite: SQLite,
              private sqlitePorter: SQLitePorter,
              private platform: Platform) {
                this.platform.ready().then(async () => {
                }).catch(error => {
                  console.log(error);
                });
              }

    async getAllMusicLocal() {
    // this.DropTable('downloadList');
    // tslint:disable-next-line: align
    // await this.dbo.executeSql("INSERT INTO downloadList VALUES ('123')") .then(() => alert('INSERT SQL'))
    //   .catch(e => alert(JSON.stringify(e)));
    // tslint:disable-next-line: align
    await this.dbo.executeSql('SELECT * FROM downloadList', []).then(async (response) => {
      this.rowsCount = response.rows.length;
      // alert(this.rowsCount);
      // if (this.rowsCount === 0) {
      //    this.dbo.executeSql("INSERT INTO downloadList VALUES ('[]')",[]);
      // }
      // alert(JSON.stringify( response.rows.item(2).songs));
      if (response.rows.length > 0) {
        for (let i = 0; i < response.rows.length; i++) {
          const data = JSON.parse(response.rows.item(i).songs);
          // alert(response.rows.item(i).songs);
          this.lists.push({
            name: data[0].name,
            fullpath: data[0].fullPath,
            nativeurl: data[0].nativeURL,
            id: data[0].id,
          });
        }
      } else {
        // tslint:disable-next-line: no-trailing-whitespace
        await this.getAllMusic();
      }
      // alert(JSON.stringify(response));
    }) .catch(e => alert(JSON.stringify(e)));

  }
  async getAllMusic() {
    // await this.DeleteTable('downloadList');
    // alert(1);
    // await this.UpdateTable('[]');
    await this.file.listDir(this.file.externalRootDirectory, 'obaorin').then(async (data) => {
      // console.log(data);
      // alert(JSON.stringify(data));
      // alert(data.length);
      // tslint:disable-next-line: prefer-for-of
      for (let n = 0; n < data.length; n++) {
        if (data[n].isDirectory) {
          await this.fetchFiles(data[n].nativeURL);
          // alert(n);
        }
      }

    });

  }
  async doRefresh(event) {
    this.lists = [];
    this.count = 0;
    await this.getAllMusic();
    event.target.complete();
      // location.reload();

  }
  async fetchFiles(base) {
    //  alert(JSON.stringify(data[i]));
    // tslint:disable-next-line: prefer-const
    let obase = base;
    const appStorageDir = base.substring(0, base.lastIndexOf('/'));
    // tslint:disable-next-line: prefer-const
    let dirName = appStorageDir.substring(appStorageDir.lastIndexOf('/') + 1);
    // let dirName = base.substring(base.lastIndexOf("/")+1);
    base = base.replace('/' + dirName, '');
    dirName = dirName.replace('%20', ' ');
    // alert(base + ' ' + dirName);
    await this.file.listDir(base, dirName).then(async (musics) => {
      //  alert(base);
      // if (folderName === '') {
      //   alert(base);
      // alert(JSON.stringify(musics));
      // }
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < musics.length; i++) {
        if (!musics[i].isDirectory) {
          // const directoryName = musics[n].name;
          // alert(JSON.stringify(musics[i]));
          const re = /(?:\.([^.]+))?$/;

          const ext = re.exec(musics[i].name)[1];
          if (ext === 'mp3') {
            // alert(musics[i].name);
            // this.getFileSize(musics[i].nativeURL);
            // alert(de);

            //  alert(JSON.stringify(data[i]));
            // tslint:disable-next-line: prefer-const
            let mname = musics[i].name.replace('.mp3', '');
            // this.count = this.count + 1;
            const count = this.lists.length;
            this.lists.push({
              name: mname,
              fullpath: musics[i].fullPath,
              nativeurl: musics[i].nativeURL,
              id: count + 1,
            });
            this.slist = [];
            this.count = this.count + 1;
            this.slist.push({
                name: mname,
                fullpath: musics[i].fullPath,
                nativeurl: musics[i].nativeURL,
                id: this.count,
              });
            this.InsertOrUpdate(this.count, JSON.stringify(this.slist));




            // alert(i);
          }
        } else if (musics[i].isDirectory) {
          // alert(musics[n].name);
          //  alert(JSON.stringify(musics[n]));
          // this.fetchFiles(musics[i].nativeURL);
        }

        // alert(JSON.stringify(this.lists));
      }
    });
  }
  async ngOnInit() {
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
      await this.getAllMusicLocal();
      // await this.getAllMusic();
      loadingEl.dismiss();
    });

  }
async getFileSize(nativeUrl) {
    let size;
    await this.file.resolveLocalFilesystemUrl(nativeUrl).then((fileEntry) => {

      fileEntry.getMetadata((metadata) => {
        // alert(JSON.stringify(metadata));
        size = metadata.size;
        // console.log("image size : " + metadata.size);
        // console.log("image date : " + metadata.modificationTime);
      });
    });
    return size;
  }

async createDB() {
  await this.sqlite.create({
  name: 'obaorin.db',
  location: 'default'
})
  .then(async (db: SQLiteObject) => {
    this.dbo = db;
    db.executeSql('create table  IF NOT EXISTS downloadList(id INTEGER PRIMARY KEY,songs LONGTEXT)', [])
      .then(() => {
        // db.executeSql("INSERT INTO downloadList VALUES ('[]')");
        // alert('Executed SQL')
      }
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
  await this.dbo.executeSql('UPDATE downloadList set songs = ?', [value]).then(() => {
      alert('Executed SQL');
    }

  ).catch(e => {
      alert(JSON.stringify(e));
    }

        );
  }
async GetTable(tableName) {
  await this.dbo.executeSql('SELECT * FROM downloadList', []).then(async (response) => {
    // alert(JSON.stringify(response.rows.item(0).songs))
      this.slist = JSON.parse(response.rows.item(0).songs);
    });
}

async DeleteTable(tableName) {
  await this.dbo.executeSql('DELETE FROM downloadList where id != ?', ['0']).then(async (response) => {
    // alert(JSON.stringify(response.rows.item(0).songs))
    // alert(JSON.stringify(response));
      // this.slist = JSON.parse(response.rows.item(0).songs);
    });
  }

  async InsertOrUpdate(id, song) {
    await this.dbo.executeSql('INSERT OR REPLACE INTO downloadList VALUES(?,?)', [id, song]).then(async (response) => {

    }).catch(e => {
      alert(JSON.stringify(e));
    }
    );
  }

}
