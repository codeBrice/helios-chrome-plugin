import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { HeliosServiceService } from '../../services/helios-service.service';
import { LoadingController, ActionSheetController, AlertController, ModalController, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { CoingeckoService } from 'src/app/services/coingecko.service';
import { SendModalPage } from './send-modal/send-modal.page';
import { ReceiveModalPage } from './receive-modal/receive-modal.page';
import { UserInfo } from 'src/app/entities/userInfo';
import { HeliosServersideService } from 'src/app/services/helios-serverside.service';
import { ErrorServer } from 'src/app/entities/errorServer';
import cryptoJs from 'crypto-js';
import { SecureStorage } from '../../utils/secure-storage';
import { Wallet } from '../../entities/wallet';
import { ExportPrivatekeyModalPage } from './export-privatekey-modal/export-privatekey-modal.page';

@Component({
  selector: 'app-home',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  constructor(
    private heliosService: HeliosServiceService,
    private loadingController: LoadingController,
    private route: ActivatedRoute,
    private router: Router,
    private coingeckoService: CoingeckoService,
    public actionSheetController: ActionSheetController,
    public alertController: AlertController,
    private modalController: ModalController,
    public toastController: ToastController,
    private heliosServersideService: HeliosServersideService,
    private secureStorage: SecureStorage
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
  secret: string;
  mainWallet: any[];
  hash: any;
  private readonly HELIOS_ID = 'helios-protocol';

  ngOnInit() {
  }

  async inicialize() {
    console.log('dashboard');
    this.today = moment();
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    await loading.present();
    this.secret = await this.secureStorage.getSecret();
    const userInfo = await this.secureStorage.getStorage('userInfo', this.secret);
    if (userInfo) {
      try {
        this.hash = userInfo.sessionHash;
        const walletsServer  = await this.heliosServersideService.getOnlineWallets(userInfo.userName, this.hash );
        const walletStorage = await this.secureStorage.getStorage( 'wallet', this.secret );
        this.notRepeat(walletsServer.keystores, walletStorage);

        const result = await this.heliosServersideService.getContacts(
          userInfo.userName,
          userInfo.sessionHash
        );
        this.secureStorage.setStorage('contacts', result.contacts, this.secret);
      } catch (error) {
        if (error.error === 2020) {
          this.router.navigate(['/reload-singin']);
        }
        const toast = await this.toastController.create({
          cssClass: 'text-red',
          message: error.errorDescription || error.message,
          duration: 2000
        });
        toast.present();
      }
    } else {
      const userInfoLocal = await this.secureStorage.getStorage('userInfoLocal', this.secret);
      this.hash = userInfoLocal.sessionHash;
    }
    const wallets = await this.secureStorage.getStorage( 'wallet', this.secret );
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
        let defaultWalletStorage = await this.secureStorage.getStorage('defaultWallet', this.secret);
        this.mainWallet = [];
        if ( defaultWalletStorage === null ) {
          const balance = await this.heliosService.getBalance(wallets[0].address);
          const usd = Number(balance) * Number(this.helios.market_data.current_price.usd);
          const wallet = {
            address: wallets[0].address ,
            balance,
            usd,
            name: wallets[0].name,
            avatar: wallets[0].avatar,
            id: wallets[0].id,
            default: true,
            privateKey: cryptoJs.AES.encrypt( wallets[0].privateKey, this.hash ).toString()
          };
          this.secureStorage.setStorage('defaultWallet', wallet, this.secret );
          defaultWalletStorage = wallet;
        }
        this.mainWallet.push( defaultWalletStorage );
        for (const wallet of wallets) {
          walletPromises.push(new Promise(async (resolve, reject) => {
            try {
              try {
                let data = null;
                if (userInfo) {
                  const bytes  = cryptoJs.AES.decrypt(wallet.privateKey, this.hash);
                  data = await this.heliosService.getReceivableTransactions(wallet.address, bytes.toString(cryptoJs.enc.Utf8));
                } else {
                  const bytes  = cryptoJs.AES.decrypt(wallet.privateKey, this.hash);
                  data = await this.heliosService.getReceivableTransactions(wallet.address, bytes.toString(cryptoJs.enc.Utf8));
                }
                if (!receivable && data) {
                  receivable = data;
                }
              } catch (error) {
                console.log('wallet que falla', wallet.address);
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
                name: wallet.name,
                avatar: wallet.avatar,
                id: wallet.id,
                default: false,
                privateKey: wallet.privateKey
              });
              this.balance += usd;
              resolve();
            } catch (error) {
              reject();
            }
          }));
        }
        await Promise.all(walletPromises);
        this.wallets.map( data => {
          if ( data.address === defaultWalletStorage.address ) {
            data.default = true;
          }
        });
        this.wallets = this.wallets.filter( wallet => wallet.address !== defaultWalletStorage.address );
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
    setTimeout(() => {
      event.target.complete();
      this.inicialize();
    }, 2000);
  }

  async presentActionSheet(index: number, wallet) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Account Options',
      buttons: [
        {
          text: 'Select account as default',
          icon: 'checkmark-circle-outline',
          handler: () => {
            this.alertController.create({
              header: 'Are you sure?',
              message: `The address <strong>${wallet.address} to default ?</strong>`,
              buttons: [
                {
                  text: 'Cancel',
                  role: 'cancel',
                  cssClass: 'secondary',
                }, {
                  text: 'Okay',
                  handler: async () => {
                    const secret = await this.secureStorage.getSecret();
                    this.secureStorage.setStorage( 'defaultWallet', wallet , secret );
                    this.inicialize();
                    this.wallets = [];
                  }
                }
              ]
            }).then((val) => val.present());
          }
        },
        {
        text: 'Share Address',
        icon: 'share',
        handler: () => {
          this.alertController.create({
            header: 'Address Wallet',
            message: `Address Wallet <strong>${wallet.address}</strong>`,
            buttons: [{
                text: 'Okay',
              }
            ]
          }).then((val) => val.present());
        }
      },
      {
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.alertController.create({
            header: 'Are you sure?',
            message: `Delete Wallet <strong>${wallet.address}?</strong>`,
            buttons: [
              {
                text: 'Cancel',
                role: 'cancel',
                cssClass: 'secondary',
              }, {
                text: 'Okay',
                handler: async ()  => {
                  const loading = await this.loadingController.create({
                    message: 'Deleting wallet...',
                    translucent: true,
                    cssClass: 'custom-class custom-loading'
                  });
                  await loading.present();
                  try {
                  this.wallets.splice(index, 1);
                  const userInfo = await this.secureStorage.getStorage('userInfo', this.secret);
                  if ( userInfo ) {
                    await this.heliosServersideService.deleteOnlineWallet( wallet.id, wallet.name,
                      userInfo.userName, userInfo.sessionHash );
                  }
                  if ( wallet.default ) {
                    this.secureStorage.setStorage('defaultWallet', this.wallets[0], this.secret);
                  }
                  this.wallets.push( this.mainWallet[0] );
                  this.secureStorage.setStorage('wallet', this.wallets, this.secret);
                  await loading.dismiss();
                  const toast = await this.toastController.create({
                    cssClass: 'text-yellow',
                    message: 'The wallet was successfully deleted.',
                    duration: 2000
                  });
                  toast.present();
                  this.inicialize();
                } catch (error) {
                  await loading.dismiss();
                  const toast = await this.toastController.create({
                    cssClass: 'text-red',
                    message: error.errorDescription || error.message,
                    duration: 2000
                  });
                  toast.present();
                }
                }
              }
            ]
          }).then((val) => val.present());
        }
      }, 
      {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel'
      }]
    });
    await actionSheet.present();
  }

  async presentActionSheetDefault(wallet) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Account Options',
      buttons: [
        {
        text: 'Share Address',
        icon: 'share',
        handler: () => {
          this.alertController.create({
            header: 'Address Wallet',
            message: `Address Wallet <strong>${wallet.address}</strong>`,
            buttons: [{
                text: 'Okay',
              }
            ]
          }).then((val) => val.present());
        }
      },{
        text: 'Export Private key',
        icon: 'key',
        handler: () => {
         this.presentModalExportPrivateKey();
        }
      },
      {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel'
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
      component: ReceiveModalPage
    });
    return await modal.present();
  }
  async presentModalExportPrivateKey() {
    const modal = await this.modalController.create({
      component: ExportPrivatekeyModalPage
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
