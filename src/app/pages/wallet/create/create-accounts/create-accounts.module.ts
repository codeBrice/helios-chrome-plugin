import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateAccountsPageRoutingModule } from './create-accounts-routing.module';

import { CreateAccountsPage } from './create-accounts.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    CreateAccountsPageRoutingModule
  ],
  declarations: [CreateAccountsPage]
})
export class CreateAccountsPageModule {}
