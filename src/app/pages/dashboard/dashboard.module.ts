import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DashboardPage } from './dashboard.page';
import { SendModalPage } from './send-modal/send-modal.page';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { ReceiveModalPage } from './receive-modal/receive-modal.page';
import { WalletFormatPipeModule } from 'src/app/pipes/WalletFormat/WalletFormatPipe.module';
import { AvatarPipeModule } from '../../pipes/AvatarPipe/AvatarPipe.module';
import { SecureStorage } from '../../utils/secure-storage';

const routes: Routes = [
  {
    path: '',
    component: DashboardPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    NgxQRCodeModule,
    WalletFormatPipeModule,
    AvatarPipeModule
  ],
  providers: [
    SecureStorage
  ],
  declarations: [DashboardPage , SendModalPage, ReceiveModalPage],
  entryComponents: [SendModalPage, ReceiveModalPage]
})
export class DashboardPageModule {}
