import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExportPrivatekeyPageRoutingModule } from './export-privatekey-routing.module';

import { ExportPrivatekeyPage } from './export-privatekey.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ExportPrivatekeyPageRoutingModule
  ],
  declarations: [ExportPrivatekeyPage]
})
export class ExportPrivatekeyPageModule {}
