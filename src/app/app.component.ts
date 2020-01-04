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
    let endDate = moment().utc().valueOf();

    this.platform.ready().then(async () => {
      const loading = await this.loadingController.create({
        message: 'Please wait...',
        translucent: true,
        cssClass: 'custom-class custom-loading'
      });
      await loading.present();
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      //find wallet in device storage
      /* const wallet = await this.storage.get('wallet');
      if( wallet != null ) {
        //redirect to dashboard
        this.router.navigate(['/tabs/home']);
      } else {
        this.router.navigate(['/homewallet']);
      } */
      this.router.navigate(['/homewallet']);
      await loading.dismiss();
    });
  }
}
