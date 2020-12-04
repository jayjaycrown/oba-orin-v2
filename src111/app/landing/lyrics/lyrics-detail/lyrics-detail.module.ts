import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LyricsDetailPageRoutingModule } from './lyrics-detail-routing.module';

import { LyricsDetailPage } from './lyrics-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LyricsDetailPageRoutingModule
  ],
  declarations: [LyricsDetailPage]
})
export class LyricsDetailPageModule {}
