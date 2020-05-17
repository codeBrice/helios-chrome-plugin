import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReloadSinginPage } from './reload-singin.page';

const routes: Routes = [
  {
    path: '',
    component: ReloadSinginPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReloadSinginPageRoutingModule {}
