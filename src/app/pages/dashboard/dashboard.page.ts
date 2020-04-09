import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { HeliosServiceService } from '../../services/helios-service.service';
import { LoadingController, ActionSheetController, AlertController, ModalController, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { CoingeckoService } from 'src/app/services/coingecko.service';
import { SendModalPage } from './send-modal/send-modal.page';
import { ReceiveModalPage } from './receive-modal/receive-modal.page';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { UserInfo } from 'src/app/entities/userInfo';
import { HeliosServersideService } from 'src/app/services/helios-serverside.service';
import { ErrorServer } from 'src/app/entities/errorServer';
import cryptoJs from 'crypto-js';
@Component({
  selector: 'app-home',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  constructor(
    private storage: Storage,
    private heliosService: HeliosServiceService,
    private loadingController: LoadingController,
    private route: ActivatedRoute,
    private router: Router,
    private coingeckoService: CoingeckoService,
    public actionSheetController: ActionSheetController,
    public alertController: AlertController,
    private modalController: ModalController,
    private socialSharing: SocialSharing,
    public toastController: ToastController,
    private heliosServersideService: HeliosServersideService
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

  async inicialize() {
    this.today = moment();
    const userInfo = await this.storage.get('userInfo');
    if (userInfo) {
      try {
        const walletsServer  = await this.heliosServersideService.getOnlineWallets(userInfo.userName, userInfo.sessionHash);
        const walletStorage = await this.storage.get('wallet');
        this.notRepeat(walletsServer.keystores, walletStorage);
      } catch (error) {
        if (error.error === 2020) {
          this.storage.clear();
          this.storage.set( 'tutorial', true );
          this.router.navigate(['/homewallet']);
        }
        const toast = await this.toastController.create({
          cssClass: 'text-red',
          message: error.errorDescription || error.message,
          duration: 2000
        });
        toast.present();
      }
    }

    const wallets = await this.storage.get('wallet');
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
                let data = null;
                if (userInfo) {
                  const bytes  = cryptoJs.AES.decrypt(wallet.privateKey, userInfo.sessionHash);
                  data = await this.heliosService.getReceivableTransactions(wallet.address, bytes.toString(cryptoJs.enc.Utf8));
                } else {
                  data = await this.heliosService.getReceivableTransactions(wallet.address, wallet.privateKey);
                }
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
                balance,
                usd,
                name: wallet.name
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

  /**
   * Nots repeat
   * @param wallets
   * @param address
   * @returns
   */
  notRepeat(wallets, walletTwo) {
    for (const wallet of wallets) {
      const result = walletTwo.find( walletFind =>
         walletFind.address.toUpperCase() === ('0x' + JSON.parse(wallet).address).toUpperCase() );
      if (!result) {
        throw new ErrorServer(2020, 'Not macth in wallets, Please log in again');
      }
    }
    return true;
  }
}
