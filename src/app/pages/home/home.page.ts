import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { HeliosServiceService } from '../../services/helios-service.service';
import { LoadingController, ActionSheetController, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { CoingeckoService } from 'src/app/services/coingecko.service';
import { LockscreenService } from 'src/plugins/lockscreen/services/lockscreen.service';

const CORRECT_PASSCODE = '1234';
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
    private coingeckoService: CoingeckoService,
    public actionSheetController: ActionSheetController,
    public alertController: AlertController
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

  doRefresh(event) {
    console.log('Begin async operation');

    setTimeout(() => {
      event.target.complete();
      this.inicialize();
    }, 2000);
  }

  async presentActionSheet(index: number, wallet) {
    console.log('presentActionSheet', index , wallet);
    const actionSheet = await this.actionSheetController.create({
      header: 'Account Options',
      buttons: [{
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: async () => {
          const alert = await this.alertController.create({
            header: 'Are you sure?',
            message: `Delete Wallet <strong>${wallet.adress}?</strong>`,
            buttons: [
              {
                text: 'Cancel',
                role: 'cancel',
                cssClass: 'secondary',
              }, {
                text: 'Okay',
                handler: () => {
                  this.wallets.splice(index, 1);
                  this.storage.set( 'wallet', this.wallets );
                }
              }
            ]
          });
          await alert.present();
        }
      }, {
        text: 'Share',
        icon: 'share',
        handler: () => {
          console.log('Share clicked');
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }
}
