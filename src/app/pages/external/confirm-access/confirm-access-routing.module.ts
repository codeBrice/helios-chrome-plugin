import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfirmAccessPage } from './confirm-access.page';

const routes: Routes = [
  {
    path: '',
    component: ConfirmAccessPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfirmAccessPageRoutingModule {}
