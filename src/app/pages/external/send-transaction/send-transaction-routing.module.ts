import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SendTransactionPage } from './send-transaction.page';

const routes: Routes = [
  {
    path: '',
    component: SendTransactionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SendTransactionPageRoutingModule {}
