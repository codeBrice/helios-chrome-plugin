import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExportPrivatekeyPage } from './export-privatekey.page';

const routes: Routes = [
  {
    path: '',
    component: ExportPrivatekeyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExportPrivatekeyPageRoutingModule {}
