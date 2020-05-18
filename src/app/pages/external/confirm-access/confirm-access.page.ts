import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { HeliosServiceService } from 'src/app/services/helios-service.service';
import { SecureStorage } from '../../../utils/secure-storage';

@Component({
  selector: 'app-confirm-access',
  templateUrl: './confirm-access.page.html',
  styleUrls: ['./confirm-access.page.scss'],
})
export class ConfirmAccessPage implements OnInit {

  chromeTab: Params;
  secret: string;
  whiteList: {}[];

  constructor( private activatedRoute: ActivatedRoute,
               private heliosService: HeliosServiceService,
               private secureStorage: SecureStorage) {
    this.activatedRoute.queryParams.subscribe( params => {
      this.chromeTab = JSON.parse(window.atob(params.tab));
    });
   }

  async ngOnInit() {
    this.secret = await this.secureStorage.getSecret();
    const whiteList = await this.secureStorage.getStorage('whiteList', this.secret);
    this.whiteList = whiteList || [];
    if (this.whiteList.find(element => element === this.chromeTab.url.split('/')[2])) {
      const defaultWallet = await this.secureStorage.getStorage('defaultWallet', this.secret );
      chrome.tabs.sendMessage(Number(this.chromeTab.id) as number, {
        type: 'access',
        address: defaultWallet.address
      });
      window.close();
    }
  }

  async access() {
    console.log('access' , this.chromeTab);
    // background
    const defaultWallet = await this.secureStorage.getStorage('defaultWallet', this.secret );
    /* chrome.runtime.sendMessage('', {
      type: 'access'
    }); */
    // save page
    this.whiteList.push(this.chromeTab.url.split('/')[2]);
    this.secureStorage.setStorage('whiteList', this.whiteList , this.secret );

    // contentscript
    chrome.tabs.sendMessage(Number(this.chromeTab.id) as number, {
      type: 'access',
      address: defaultWallet.address
    });

    window.close();
  }

  cancel() {
    window.close();
  }
}
