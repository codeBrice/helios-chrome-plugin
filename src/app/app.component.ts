import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { HeliosServiceService } from './services/helios-service.service';
import { SecureStorage } from './utils/secure-storage';

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
    private storage: Storage,
    private router: Router,
    private loadingController: LoadingController,
    private secureStorage: SecureStorage
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
    const secret = await this.secureStorage.getSecret();
    const wallet = await this.secureStorage.getStorage( 'wallet', secret );
    if (wallet != null) {
        this.router.navigate(['/dashboard']);
        await loading.dismiss();
    } else {
      this.isCorrect = true;
      this.router.navigate(['/homewallet']);
      await loading.dismiss();
    }
  }
}
