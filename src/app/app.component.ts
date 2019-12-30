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
        this.router.navigate(['/homewallet']);
        await loading.onDidDismiss();
      }).catch( error => {
        console.error(error);
      });
    });
  }
}
