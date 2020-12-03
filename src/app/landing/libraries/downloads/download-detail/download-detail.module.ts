import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DownloadDetailPageRoutingModule } from './download-detail-routing.module';

import { DownloadDetailPage } from './download-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DownloadDetailPageRoutingModule
  ],
  declarations: [DownloadDetailPage]
})
export class DownloadDetailPageModule {}
