import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TransactionPage } from './transaction.page';
import { DescriptionPipe } from '../../pipes/DescriptionPipe';
import { WalletFormatPipeModule } from '../../pipes/WalletFormat/WalletFormatPipe.module';
import { TransactionDetailModalPage } from './transaction-detail-modal/transaction-detail-modal.page';

const routes: Routes = [
  {
    path: '',
    component: TransactionPage
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
  declarations: [TransactionPage, DescriptionPipe , TransactionDetailModalPage],
  entryComponents: [TransactionDetailModalPage]
})
export class TransactionPageModule {}
