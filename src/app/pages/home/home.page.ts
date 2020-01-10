import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { HeliosServiceService } from '../../services/helios-service.service';
import { LoadingController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { CoingeckoService } from 'src/app/services/coingecko.service';

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
    private route: ActivatedRoute,
    private router: Router,
    private coingeckoService: CoingeckoService
    ) {
      route.params.subscribe(val => {
        this.inicialize();
      });
    }

  wallets: any[];
  balance: any;
  gasPrice: number;
  today: any;
  helios: any;
  up: boolean;
  slideOpts: any;

  private readonly HELIOS_ID = 'helios-protocol';

  ngOnInit() {
    // this.inicialize();
  }

  inicialize() {
    this.today = moment();
    this.storage.get('wallet').then(async (wallets) => {
      if (wallets != null) {

        this.slideOpts = {
          slidesPerView: wallets.length > 1 ? 2 : 1,
          initialSlide: 0,
          speed: 400
        };

        const loading = await this.loadingController.create({
          message: 'Please wait...',
          translucent: true,
          cssClass: 'custom-class custom-loading'
        });
        await loading.present();
        this.helios = await this.coingeckoService.getCoin(this.HELIOS_ID).toPromise();
        this.wallets = [];
        this.balance = 0;
        (this.helios.market_data.price_change_percentage_24h > 0) ? this.up = true : this.up = false;
        for (const wallet of wallets) {
          const balance = await this.heliosService.getBalance(wallet);
          const usd = Number(balance) * Number(this.helios.market_data.current_price.usd);
          this.wallets.push({
            adress: wallet ,
            balance ,
            usd
          });
          this.balance += usd;
        }
        await loading.dismiss();
      }
      this.gasPrice = await this.heliosService.getGasPrice();
    });
  }

  goToImport() {
    this.router.navigate(['/import', {add: true}]);
  }
}
