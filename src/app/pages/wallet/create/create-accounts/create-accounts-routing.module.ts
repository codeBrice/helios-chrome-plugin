import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateAccountsPage } from './create-accounts.page';

const routes: Routes = [
  {
    path: '',
    component: CreateAccountsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateAccountsPageRoutingModule {}
