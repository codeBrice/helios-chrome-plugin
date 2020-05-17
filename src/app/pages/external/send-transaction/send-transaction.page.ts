import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController, ToastController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CoingeckoService } from 'src/app/services/coingecko.service';
import { HeliosServiceService } from 'src/app/services/helios-service.service';
import { Router } from '@angular/router';
import cryptoJs from 'crypto-js';
import { SecureStorage } from '../../../utils/secure-storage';

@Component({
  selector: 'app-send-transaction',
  templateUrl: './send-transaction.page.html',
  styleUrls: ['./send-transaction.page.scss'],
})
export class SendTransactionPage implements OnInit {

  constructor(private modalController: ModalController, private formBuilder: FormBuilder, 
              private loadingController: LoadingController,
              private coingeckoService: CoingeckoService, private heliosService: HeliosServiceService,
              public toastController: ToastController,
              private router: Router, private secureStorage: SecureStorage) { }

  sendForm: FormGroup;
  wallets: any;
  currentPrice: number;
  gasPrice: number;
  totalHls = 0;
  totalUsd = 0;
  secret: string;
  to: any[];
  isInvalid: boolean = false;
  private readonly HELIOS_ID = 'helios-protocol';
  //TODO CHANGE TO OBJECCT FROM CONTENT SCRIPT
  transaction: any  = ({
    from: '0x9f53847cc211147bF655d76e8bC7B211E9710e2c',
    to: '0x07D62a36D35261AfEcF6cb89382D393a398edc1a',
    value: 10000
  });

  async ngOnInit() {
    this.sendForm = this.formBuilder.group({
      amount: new FormControl('', [Validators.required, Validators.min(1)]),
      currency: new FormControl('hls', [Validators.required]),
      toAddress: new FormControl('', [Validators.required]),
      from: new FormControl('', [Validators.required])
    }, {
      validator: [this.isAddress('toAddress')]
    });
    try {
      this.sendForm.controls['amount'].setValue( this.transaction.value );
      this.sendForm.controls['toAddress'].setValue( this.transaction.to );
      this.sendForm.controls['from'].setValue( this.transaction.from );
      this.to = [];
      const balance = await this.heliosService.getBalance( this.transaction.from );
      if ( balance < this.transaction.value ) {
        this.isInvalid = true;
        const toast = await this.toastController.create({
          cssClass: 'text-red',
          message: 'Insufficient funds.',
          duration: 3000
        });
        toast.present();
      }
      this.to.push({ address: this.transaction.to , avatar: cryptoJs.MD5( this.transaction.to ).toString()});
      this.secret = await this.secureStorage.getSecret();
      let wallets = await this.secureStorage.getStorage('wallet', this.secret);
      wallets = wallets.filter( wallet => wallet.address === this.transaction.from );
      this.wallets = [];
      const loading = await this.loadingController.create({
        message: 'Please wait...',
        translucent: true,
        cssClass: 'custom-class custom-loading'
      });
      await loading.present();
      this.gasPrice = await this.heliosService.getGasPrice();
      const helios: any = await this.coingeckoService.getCoin(this.HELIOS_ID).toPromise();
      for (const wallet of wallets) {
        const balance = await this.heliosService.getBalance(wallet.address);
        this.currentPrice = helios.market_data.current_price.usd;
        const usd = Number(balance) * Number(this.currentPrice);
        this.wallets.push({
          address: wallet.address,
          balance,
          usd,
          privateKey: wallet.privateKey,
          avatar: wallet.avatar
        });
      }
      this.updateTotals();
      await loading.dismiss();
    } catch (error) {
      const toast = await this.toastController.create({
        cssClass: 'text-red',
        message: error.message,
        duration: 2000
      });
      toast.present();
    }
  }

  updateTotals() {
    console.log( 'updateTotals');
    if (this.sendForm.value.currency === 'hls') {
      this.totalHls = this.sendForm.value.amount || 0;
      this.totalUsd = Number(this.sendForm.value.amount) * Number(this.currentPrice);
    } else {
      this.totalUsd = this.sendForm.value.amount || 0;
      this.totalHls = Number(this.sendForm.value.amount) / Number(this.currentPrice);
    }
  }

  async send() {
    let result = false;
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    await loading.present();
    try {
      const transaction = {
        from: this.sendForm.value.from,
        to: this.sendForm.value.toAddress,
        value: this.heliosService.toWeiEther((String(this.sendForm.value.amount))),
        gas: 21000,
        gasPrice: this.heliosService.toWei(String(this.gasPrice))
      };
      const userInfo = await this.secureStorage.getStorage('userInfo', this.secret);
      if (userInfo) {
        const key = this.wallets.find(element => element.address === this.sendForm.value.from).privateKey;
        const bytes = cryptoJs.AES.decrypt(key, userInfo.sessionHash);
        result = await this.heliosService.sendTransaction(transaction, bytes.toString(cryptoJs.enc.Utf8));
      } else {
        const userInfoLocal = await this.secureStorage.getStorage('userInfoLocal', this.secret);
        const key = this.wallets.find(element => element.address === this.sendForm.value.from).privateKey;
        const bytes = cryptoJs.AES.decrypt(key, userInfoLocal.sessionHash);
        result = await this.heliosService.sendTransaction(transaction, bytes.toString(cryptoJs.enc.Utf8));
      }

      const toast = await this.toastController.create({
        cssClass: 'text-yellow',
        message: 'Success transaction.',
        duration: 2000
      });
      toast.present();

    } catch (error) {
      const toast = await this.toastController.create({
        cssClass: 'text-red',
        message: error.message,
        duration: 2000
      });
      toast.present();
    }

    this.modalController.dismiss(result);

    await loading.dismiss();
  }

  updateRequired() {
    if (this.sendForm.value.to !== '99') {
      this.sendForm.controls.toAddress.setValue(this.sendForm.value.to);
    } else {
      this.sendForm.controls.toAddress.setValue('');
    }
  }

  isAddress(addressData: string) {
    return (formGroup: FormGroup) => {
      const address = formGroup.controls[addressData];
      if (this.heliosService.isAddress(address.value)) {
        address.setErrors(null);
      } else {
        address.setErrors({ addressError: true });
      }
    };
  }

  dismiss() {
    this.modalController.dismiss(false);
  }

}