import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfirmAccessPageRoutingModule } from './confirm-access-routing.module';

import { ConfirmAccessPage } from './confirm-access.page';
import { SecureStorage } from '../../../utils/secure-storage';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfirmAccessPageRoutingModule
  ],
  providers: [
    SecureStorage
  ],
  declarations: [ConfirmAccessPage]
})
export class ConfirmAccessPageModule {}
