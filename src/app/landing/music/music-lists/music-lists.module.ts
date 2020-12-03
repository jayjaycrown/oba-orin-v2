import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MusicListsPageRoutingModule } from './music-lists-routing.module';

import { MusicListsPage } from './music-lists.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MusicListsPageRoutingModule
  ],
  declarations: [MusicListsPage]
})
export class MusicListsPageModule {}
