import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'music-list',
    loadChildren: () => import('./music-list/music-list.module').then( m => m.MusicListPageModule)
  },
  {
    path: 'music-detail/:id',
    loadChildren: () => import('./music-list/music-detail/music-detail.module').then( m => m.MusicDetailPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
