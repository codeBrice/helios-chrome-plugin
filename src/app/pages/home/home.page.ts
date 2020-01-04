import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { HeliosServiceService } from '../../services/helios-service.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor( 
    private storage: Storage,
    private heliosService: HeliosServiceService,
    private loadingController: LoadingController
    ) { }
  wallet: string;
  balance: any;
  ngOnInit() {
    // Or to get a key/value pair
    this.storage.get('wallet').then((wallet) => {
      this.heliosService.connectToFirstAvailableNode().then( async () => {
        const loading = await this.loadingController.create({
          message: 'Please wait...',
          translucent: true,
          cssClass: 'custom-class custom-loading'
        });
        await loading.present();
        this.wallet = wallet;
        this.balance = await this.heliosService.getBalance('0x4A1383744eED3DBE37B7A0870b15FeA3cE319A66');
        //this.heliosService.getAllTransactions('0x4A1383744eED3DBE37B7A0870b15FeA3cE319A66', startDate, endDate);
        await loading.dismiss();
      }).catch( error => {
        console.error(error);
      });
    });
  }

}
