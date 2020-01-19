import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TransactionDetailModalPage } from './transaction-detail-modal.page';
import { WalletFormatPipeModule } from '../../../pipes/WalletFormat/WalletFormatPipe.module';

const routes: Routes = [
  {
    path: '',
    component: TransactionDetailModalPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WalletFormatPipeModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TransactionDetailModalPage]
})
export class TransactionDetailModalPageModule {}
