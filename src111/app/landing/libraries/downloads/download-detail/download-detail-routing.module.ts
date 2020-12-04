import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DownloadDetailPage } from './download-detail.page';

const routes: Routes = [
  {
    path: '',
    component: DownloadDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DownloadDetailPageRoutingModule {}
