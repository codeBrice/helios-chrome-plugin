import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExportPrivatekeyModalPageRoutingModule } from './export-privatekey-modal-routing.module';

import { ExportPrivatekeyModalPage } from './export-privatekey-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ExportPrivatekeyModalPageRoutingModule
  ],
  declarations: [ExportPrivatekeyModalPage]
})
export class ExportPrivatekeyModalPageModule {}
