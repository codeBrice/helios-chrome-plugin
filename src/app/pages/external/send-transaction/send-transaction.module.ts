import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SendTransactionPageRoutingModule } from './send-transaction-routing.module';
import { SendTransactionPage } from './send-transaction.page';
import { SecureStorage } from '../../../utils/secure-storage';
import { AvatarPipeModule } from '../../../pipes/AvatarPipe/AvatarPipe.module';
import { WalletFormatPipeModule } from 'src/app/pipes/WalletFormat/WalletFormatPipe.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SendTransactionPageRoutingModule,
    AvatarPipeModule,
    WalletFormatPipeModule
  ],
  providers: [
    SecureStorage
  ],
  declarations: [SendTransactionPage]
})
export class SendTransactionPageModule {}
