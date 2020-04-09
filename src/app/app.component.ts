import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { HeliosServiceService } from './services/helios-service.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  isCorrect = false; //TODO false pin activate
  enableTouchIdFaceId = false;

  public selectedIndex = 0;
  public appPages = [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: 'keypad'
    },
    {
      title: 'Transaction',
      url: '/transaction',
      icon: '/assets/images/exchange.svg'
    },
    {
      title: 'Chart',
      url: '/chart',
      icon: 'analytics'
    },
    {
      title: 'Setting',
      url: '/setting',
      icon: '/assets/images/settings.svg'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private storage: Storage,
    private router: Router,
    private loadingController: LoadingController,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      await this.loadWallets();
    });
  }

  private async loadWallets() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    await loading.present();
    // this.statusBar.styleDefault();
    // find wallet in device storage
    console.log('app component');
    const wallet = await this.storage.get('wallet');
    if (wallet != null) {
        this.router.navigate(['/dashboard']);
        await loading.dismiss();
    } else {
      const val = await this.storage.get('tutorial');
      this.isCorrect = true;
      if (val) {
        this.router.navigate(['/homewallet']);
      } else {
        this.router.navigate(['/tutorial']);
      }
      await loading.dismiss();
    }
    this.splashScreen.hide();
  }
}
