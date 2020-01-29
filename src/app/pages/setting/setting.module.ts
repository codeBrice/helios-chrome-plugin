import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SettingPage } from './setting.page';
import { SecurityModalPage } from './security-modal/security-modal.page';
import { ContactsModalPage } from './contacts-modal/contacts-modal.page';

const routes: Routes = [
  {
    path: '',
    component: SettingPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
  ],
  declarations: [SettingPage, SecurityModalPage, ContactsModalPage],
  entryComponents: [SecurityModalPage, ContactsModalPage]
})
export class SettingPageModule {}
