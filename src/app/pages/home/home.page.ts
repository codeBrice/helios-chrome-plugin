import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { HeliosServiceService } from '../../services/helios-service.service';
import { LoadingController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor( 
    private storage: Storage,
    private heliosService: HeliosServiceService,
    private loadingController: LoadingController,
    private route: ActivatedRoute
    ) {
      route.params.subscribe(val => {
        this.inicialize();
      });
    }

  wallets: [];
  balance: any;
  gasPrice: number;
  today: any;
  slideOpts = {
    slidesPerView: 2,
    initialSlide: 0,
    speed: 400
  };

  ngOnInit() {
    //this.inicialize();
  }

  inicialize() {
    this.today = moment();
    this.storage.get('wallet').then(async (wallets) => {
      if (wallets != null) {
        const loading = await this.loadingController.create({
          message: 'Please wait...',
          translucent: true,
          cssClass: 'custom-class custom-loading'
        });
        await loading.present();
        this.wallets = wallets;
        this.balance = await this.heliosService.getBalance('0x4A1383744eED3DBE37B7A0870b15FeA3cE319A66');
        //this.heliosService.getAllTransactions('0x4A1383744eED3DBE37B7A0870b15FeA3cE319A66', startDate, endDate);
        await loading.dismiss();
      }
      this.gasPrice = await this.heliosService.getGasPrice();
    });
  }
}
