import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { HeliosServiceService } from '../../services/helios-service.service';
import { LoadingController, ActionSheetController, AlertController, ModalController, ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { CoingeckoService } from 'src/app/services/coingecko.service';
import { SendModalPage } from './send-modal/send-modal.page';
import { ReceiveModalPage } from './receive-modal/receive-modal.page';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
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
    public alertController: AlertController,
    private modalController: ModalController,
    private socialSharing: SocialSharing,
    public toastController: ToastController
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
      const loading = await this.loadingController.create({
        message: 'Please wait...',
        translucent: true,
        cssClass: 'custom-class custom-loading'
      });
      await loading.present();
      if (wallets != null) {

        this.slideOpts = {
          slidesPerView: wallets.length > 1 ? 2 : 1,
          initialSlide: 0,
          speed: 400
        };

        try {

          this.helios = await this.coingeckoService.getCoin(this.HELIOS_ID).toPromise();
          this.wallets = [];
          this.balance = 0;
          (this.helios.market_data.price_change_percentage_24h > 0) ? this.up = true : this.up = false;
          let receivable = false;
          const walletPromises = [];
          await this.heliosService.connectToFirstAvailableNode();
          for (const wallet of wallets) {
            walletPromises.push(new Promise(async (resolve, reject) => {
              try {
                try {
                  const data = await this.heliosService.getReceivableTransactions(wallet.address, wallet.privateKey);
                  if (!receivable && data) {
                    receivable = data;
                  }
                } catch (error) {
                  const toast = await this.toastController.create({
                    cssClass: 'text-red',
                    message: error.message,
                    duration: 2000
                  });
                  toast.present();
                }
                const balance = await this.heliosService.getBalance(wallet.address);
                const usd = Number(balance) * Number(this.helios.market_data.current_price.usd);
                this.wallets.push({
                  address: wallet.address ,
                  balance ,
                  usd
                });
                this.balance += usd;
                resolve();
              } catch (error) {
                reject();
              }
            }));
          }
          await Promise.all(walletPromises)
          if (receivable) {
            const toast = await this.toastController.create({
              cssClass: 'text-yellow',
              message: 'You have received new transactions!',
              duration: 2000
            });
            toast.present();
          }
        } catch (error) {
          const toast = await this.toastController.create({
            cssClass: 'text-red',
            message: error.message,
            duration: 2000
          });
          toast.present();
        }
      }
      try {
        this.gasPrice = await this.heliosService.getGasPrice();
      } catch (error) {
        const toast = await this.toastController.create({
          cssClass: 'text-red',
          message: error.message,
          duration: 2000
        });
        toast.present();
      }
      await loading.dismiss();
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
            message: `Delete Wallet <strong>${wallet.address}?</strong>`,
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
          this.socialSharing.share(`Helios Wallet: ${wallet.address}`);
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

  async presentModalSend() {
    const modal = await this.modalController.create({
      component: SendModalPage,
    });
    modal.onDidDismiss().then(result => {
      if (result.data) {
        this.inicialize();
      }
    });
    return await modal.present();
  }

  async presentModalReceive() {
    const modal = await this.modalController.create({
      component: ReceiveModalPage,
    });
    return await modal.present();
  }
}
