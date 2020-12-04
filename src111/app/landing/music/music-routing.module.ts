import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MusicPage } from './music.page';

const routes: Routes = [
  {
    path: '',
    component: MusicPage
  },
  {
    path: 'music-lists',
    loadChildren: () => import('./music-lists/music-lists.module').then( m => m.MusicListsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MusicPageRoutingModule {}
