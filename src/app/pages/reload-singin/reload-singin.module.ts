import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule ,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReloadSinginPageRoutingModule } from './reload-singin-routing.module';

import { ReloadSinginPage } from './reload-singin.page';
import { SecureStorage } from '../../utils/secure-storage';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ReloadSinginPageRoutingModule
  ],
  providers: [
    SecureStorage
  ],
  declarations: [ReloadSinginPage]
})
export class ReloadSinginPageModule {}
