import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { HeliosServiceService } from './services/helios-service.service';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private heliosService: HeliosServiceService,
    private storage: Storage,
    private router: Router,
    private loadingController: LoadingController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    let startDate = moment().utc().subtract(3, 'months').valueOf();
    console.log(startDate);

    let endDate = moment().utc().valueOf();

    this.platform.ready().then(async () => {
      const loading = await this.loadingController.create({
        spinner: null,
        duration: 5000,
        message: 'Please wait...',
        translucent: true,
        cssClass: 'custom-class custom-loading'
      });
      await loading.present();
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.heliosService.connectToFirstAvailableNode().then( async () => {
        this.heliosService.getBalance('0x4A1383744eED3DBE37B7A0870b15FeA3cE319A66');
        this.heliosService.getAllTransactions('0x4A1383744eED3DBE37B7A0870b15FeA3cE319A66', startDate, endDate);
        // this.heliosService.accountCreate("123");
        //this.storage.set('wallet', '0x4A1383744eED3DBE37B7A0870b15FeA3cE319A66')
        //this.heliosService.privateKeyToAccount('0x5a8cf2f9d58bc74e5a179c3a2b2d9ccafedad634dc2ace38f57b18690f0af8c2'); //adress 0x610DA3BA540A9B316451DB1bD5950d37205be6ec
        //this.heliosService.jsonToAccount('{"version":3,"id":"95142025-0f57-4629-8069-6ace0d4adb6d","address":"610da3ba540a9b316451db1bd5950d37205be6ec","crypto":{"ciphertext":"1008fca4d53b263c32e24b584a69afd9e7c066a34bd891ddd6d3516942f862c7","cipherparams":{"iv":"32fcd33d57308465a17e7e393c9dc1ff"},"cipher":"aes-128-ctr","kdf":"scrypt","kdfparams":{"dklen":32,"salt":"ed497b2849e9a40249eaac75ae9f4fcfb318be6484c5053363e5968421073ad6","n":8192,"r":8,"p":1},"mac":"2e4ce619efccade1fc2e4d07f074cfb0f8a43f6a8e6b1ae7ad4ff2b6718236d7"}}', '123');
        this.router.navigate(['/homewallet']);
        await loading.onDidDismiss();
      }).catch( error => {
        console.error(error);
      });
    });
  }
}
