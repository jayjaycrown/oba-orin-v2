import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MusicPage } from './music.page';

const routes: Routes = [
  {
    path: '',
    component: MusicPage
  },
  {
    path: 'music-lists/:name',
    loadChildren: () => import('./music-lists/music-lists.module').then( m => m.MusicListsPageModule)
  },
  {
    path: 'music-lists/music-select/:id',
    loadChildren: () => import('./music-lists/music-select/music-select.module').then( m => m.MusicSelectPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MusicPageRoutingModule {}
