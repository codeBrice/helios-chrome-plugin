import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';
import { LockscreenService } from './services/lockscreen.service';
import { KeypadPageModule } from './components/keypad/keypad.module';

@NgModule({
  declarations: [],
  imports: [
    IonicModule,
    CommonModule,
    KeypadPageModule,
  ],
  providers: [
    FingerprintAIO,
    LockscreenService,
  ],
  exports: []
})
export class LockscreenModule { }
