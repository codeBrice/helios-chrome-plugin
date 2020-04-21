import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfirmAccessPageRoutingModule } from './confirm-access-routing.module';

import { ConfirmAccessPage } from './confirm-access.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfirmAccessPageRoutingModule
  ],
  declarations: [ConfirmAccessPage]
})
export class ConfirmAccessPageModule {}
