import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TransactionPage } from './transaction.page';
import { DescriptionPipe } from '../../pipes/DescriptionPipe';

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
    RouterModule.forChild(routes)
  ],
  declarations: [TransactionPage, DescriptionPipe]
})
export class TransactionPageModule {}
