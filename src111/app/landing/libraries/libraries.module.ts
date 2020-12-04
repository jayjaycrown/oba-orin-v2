import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LibrariesPageRoutingModule } from './libraries-routing.module';

import { LibrariesPage } from './libraries.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LibrariesPageRoutingModule
  ],
  declarations: [LibrariesPage]
})
export class LibrariesPageModule {}
