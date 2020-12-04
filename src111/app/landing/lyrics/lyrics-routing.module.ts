import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LyricsPage } from './lyrics.page';

const routes: Routes = [
  {
    path: '',
    component: LyricsPage
  },
  {
    path: 'lyrics-detail',
    loadChildren: () => import('./lyrics-detail/lyrics-detail.module').then( m => m.LyricsDetailPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LyricsPageRoutingModule {}
