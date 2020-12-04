import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MusicListPageRoutingModule } from './music-list-routing.module';

import { MusicListPage } from './music-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MusicListPageRoutingModule
  ],
  declarations: [MusicListPage]
})
export class MusicListPageModule {}
