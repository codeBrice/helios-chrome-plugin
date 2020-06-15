import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExportPrivatekeyModalPage } from './export-privatekey-modal.page';

const routes: Routes = [
  {
    path: '',
    component: ExportPrivatekeyModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExportPrivatekeyModalPageRoutingModule {}
