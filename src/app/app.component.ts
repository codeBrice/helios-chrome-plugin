import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { LockscreenService } from 'src/plugins/lockscreen/services/lockscreen.service';
import { HeliosServiceService } from './services/helios-service.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  isCorrect = true; //TODO false pin activate
  enableTouchIdFaceId = false;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private storage: Storage,
    private router: Router,
    private loadingController: LoadingController,
    private lockscreenService: LockscreenService,
    private heliosService: HeliosServiceService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      /* this.platform.pause.subscribe(() => {
        console.log('****UserdashboardPage PAUSED****');
      }); */
      /* this.platform.resume.subscribe(async () => {
        await this.heliosService.connectToFirstAvailableNode();
        this.isCorrect = false;
        if (sessionStorage.getItem( 'camera') === 'true') {
          this.isCorrect = true;
          sessionStorage.clear();
        }
        console.log('****UserdashboardPage RESUMED****');
        this.storage.get('wallet').then(async (wallet) => {
          if (wallet != null) {
            if (!this.isCorrect) {
              this.showLockscreen();
            }
          }
        });
      }); */
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
    await this.heliosService.connectToFirstAvailableNode();
    this.storage.get('wallet').then(async (wallet) => {
      if (wallet != null) {
       /*  if (!this.isCorrect) {
          this.showLockscreen();
        } else { */
          // redirect to dashboard
          this.router.navigate(['/tabs/home']);
        /* } */
          await loading.dismiss();
      } else {
        this.storage.get('tutorial').then(async (val) => {
          this.isCorrect = true;
          if (val) {
            this.router.navigate(['/homewallet']);
          } else {
            this.router.navigate(['/tutorial']);
          }
          await loading.dismiss();
        });
      }
      this.splashScreen.hide();
    });
  }

  showLockscreen() {
    this.storage.get( 'passcode').then(storageData => {
      if (storageData.use) {
        const options = {
          passcode : storageData.passcode,
          enableTouchIdFaceId: this.enableTouchIdFaceId,
        };
        this.lockscreenService.verify(options)
          .then((response: any) => {
            const { data } = response;
            console.log('Response from lockscreen service: ', data);
            if (data.type === 'dismiss') {
              this.isCorrect = data.data;
            } else {
              this.isCorrect = false;
            }
          });
      } else {
        this.isCorrect = true;
        this.router.navigate(['/tabs/home']);
      }
    });
  }
}
