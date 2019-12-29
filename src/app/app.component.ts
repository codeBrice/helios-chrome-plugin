import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { HeliosServiceService } from './services/helios-service.service';
import { Storage } from '@ionic/storage';

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
    this.platform.ready().then(async () => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.heliosService.connectToFirstAvailableNode().then(() => {
        this.heliosService.getBalance('0x4A1383744eED3DBE37B7A0870b15FeA3cE319A66');
        //this.heliosService.getTransaction('0x6bc56e50ad6776793be1c2b001d1798404f58e1c794bd013d5288e62226a68bf');
        this.storage.set('wallet', '0x4A1383744eED3DBE37B7A0870b15FeA3cE319A66')
      }).catch( error => {
        console.error(error);
      });
    });
  }
}
