import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DownloadsPage } from './downloads.page';

const routes: Routes = [
  {
    path: '',
    component: DownloadsPage
  },
  {
    path: 'download-detail/:id',
    loadChildren: () => import('./download-detail/download-detail.module').then( m => m.DownloadDetailPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DownloadsPageRoutingModule {}
