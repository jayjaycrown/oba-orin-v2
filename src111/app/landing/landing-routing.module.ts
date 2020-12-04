import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LandingPage } from './landing.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: LandingPage,
    children: [
      {
        path: 'libraries',
        loadChildren: () => import('./libraries/libraries.module').then( m => m.LibrariesPageModule)
      },
      {
        path: 'lyrics',
        loadChildren: () => import('./lyrics/lyrics.module').then( m => m.LyricsPageModule)
      },
      {
        path: 'account',
        loadChildren: () => import('./account/account.module').then( m => m.AccountPageModule)
      },
      {
        path: 'music',
        loadChildren: () => import('./music/music.module').then( m => m.MusicPageModule)
      },
      {
        path: '',
        redirectTo: '/home/tabs/music',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/home/tabs/music',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LandingPageRoutingModule {}
