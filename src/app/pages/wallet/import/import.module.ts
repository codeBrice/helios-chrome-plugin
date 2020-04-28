import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ImportPage } from './import.page';
import { SecureStorage } from '../../../utils/secure-storage';

const routes: Routes = [
  {
    path: '',
    component: ImportPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    SecureStorage
  ],
  declarations: [ImportPage]
})
export class ImportPageModule {}
