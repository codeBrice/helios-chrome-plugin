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

  queryParams: Params;

  constructor( private activatedRoute: ActivatedRoute,
               private heliosService: HeliosServiceService,
               private secureStorage: SecureStorage) {
    this.activatedRoute.queryParams.subscribe( params => {
      this.queryParams = params;
    });
   }

  ngOnInit() {
  }

  async access() {
    console.log('access' , this.queryParams);
    // background
    const secret = await this.secureStorage.getSecret();
    const defaultWallet = await this.secureStorage.getStorage('defaultWallet', secret );
    /* chrome.runtime.sendMessage('', {
      type: 'access'
    }); */
    // contentscript
    chrome.tabs.sendMessage(Number(this.queryParams.id) as number, {
      type: 'access',
      address: defaultWallet.address
    });

    window.close();
  }
}
