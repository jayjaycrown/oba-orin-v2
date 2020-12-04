import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MusicListPage } from './music-list.page';

const routes: Routes = [
  {
    path: '',
    component: MusicListPage
  },
  {
    path: ':musicId',
    loadChildren: () => import('./music-detail/music-detail.module').then( m => m.MusicDetailPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MusicListPageRoutingModule {}
