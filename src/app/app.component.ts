import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { HeliosServiceService } from './services/helios-service.service';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';

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
    private storage: Storage
  ) {
    this.initializeApp();
  }

  initializeApp() {

    let startDate = moment().utc().subtract(3, 'months').valueOf();
    console.log(startDate);

    let endDate = moment().utc().valueOf();

    this.platform.ready().then(async () => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.heliosService.connectToFirstAvailableNode().then(() => {
        this.heliosService.getBalance('0x4A1383744eED3DBE37B7A0870b15FeA3cE319A66');
        this.heliosService.getAllTransactions('0x4A1383744eED3DBE37B7A0870b15FeA3cE319A66', startDate, endDate);
        // this.storage.set('wallet', '0x4A1383744eED3DBE37B7A0870b15FeA3cE319A66')
        // this.heliosService.accountCreate("123");
        // this.heliosService.getTransaction('0x823ebea0939eea2c9cc8a0c0b351de4513632e5240d64ee6e900ed2b71b1f4ed');
        this.heliosService.getTransactionReceipt('0x823ebea0939eea2c9cc8a0c0b351de4513632e5240d64ee6e900ed2b71b1f4ed');
      }).catch( error => {
        console.error(error);
      });
    });
  }
}
