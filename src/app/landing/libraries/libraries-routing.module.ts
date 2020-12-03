import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LibrariesPage } from './libraries.page';

const routes: Routes = [
  {
    path: '',
    component: LibrariesPage
  },
  {
    path: 'music-list',
    loadChildren: () => import('./music-list/music-list.module').then( m => m.MusicListPageModule)
  },
  {
    path: 'lyrics',
    loadChildren: () => import('./lyrics/lyrics.module').then( m => m.LyricsPageModule)
  },
  {
    path: 'downloads',
    loadChildren: () => import('./downloads/downloads.module').then( m => m.DownloadsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LibrariesPageRoutingModule {}
