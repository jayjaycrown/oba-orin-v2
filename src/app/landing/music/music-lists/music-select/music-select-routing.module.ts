import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MusicSelectPage } from './music-select.page';

const routes: Routes = [
  {
    path: '',
    component: MusicSelectPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MusicSelectPageRoutingModule {}
