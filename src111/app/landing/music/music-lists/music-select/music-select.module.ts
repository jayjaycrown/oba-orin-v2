import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MusicSelectPageRoutingModule } from './music-select-routing.module';

import { MusicSelectPage } from './music-select.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MusicSelectPageRoutingModule
  ],
  declarations: [MusicSelectPage]
})
export class MusicSelectPageModule {}
