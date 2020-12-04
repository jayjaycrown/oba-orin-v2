import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LyricsDetailPage } from './lyrics-detail.page';

const routes: Routes = [
  {
    path: '',
    component: LyricsDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LyricsDetailPageRoutingModule {}
