import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MusicListsPage } from './music-lists.page';

const routes: Routes = [
  {
    path: '',
    component: MusicListsPage
  },
  {
    path: 'music-select',
    loadChildren: () => import('./music-select/music-select.module').then( m => m.MusicSelectPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MusicListsPageRoutingModule {}
