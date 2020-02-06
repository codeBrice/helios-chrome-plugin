import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { HomePage } from './home.page';
import { SendModalPage } from './send-modal/send-modal.page';
import { QRCodeModule } from 'angularx-qrcode';
import { ReceiveModalPage } from './receive-modal/receive-modal.page';
import { WalletFormatPipeModule } from 'src/app/pipes/WalletFormat/WalletFormatPipe.module';
const routes: Routes = [
  {
    path: '',
    component: HomePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    QRCodeModule,
    WalletFormatPipeModule
  ],
  declarations: [HomePage , SendModalPage, ReceiveModalPage],
  entryComponents: [SendModalPage, ReceiveModalPage]
})
export class HomePageModule {}
