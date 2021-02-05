import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController, ToastController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { Contact } from 'src/app/entities/contact';
import { CoingeckoService } from 'src/app/services/coingecko.service';
import { HeliosServiceService } from 'src/app/services/helios-service.service';
import { Router } from '@angular/router';
import cryptoJs from 'crypto-js';
import { SecureStorage } from '../../../utils/secure-storage';

@Component({
  selector: 'app-send-modal',
  templateUrl: './send-modal.page.html',
  styleUrls: ['./send-modal.page.scss'],
})
export class SendModalPage implements OnInit {

  constructor(private modalController: ModalController, private formBuilder: FormBuilder,
              private storage: Storage, private loadingController: LoadingController,
              private coingeckoService: CoingeckoService, private heliosService: HeliosServiceService,
              public toastController: ToastController,
              private router: Router, private secureStorage: SecureStorage) {
               }
              

  sendForm: FormGroup;
  contactsList: Contact[];
  wallets: any;
  currentPrice: number;
  gasPrice: number;
  totalHls = 0;
  totalUsd = 0;
  secret: string;
  globalWallet:any;
  wallet:any;
  isInvalid:boolean=true;
  private readonly HELIOS_ID = 'helios-protocol';

  async ngOnInit() {
    this.sendForm = this.formBuilder.group({
      amount: new FormControl('', [Validators.required, Validators.min(1)]),
      currency: new FormControl('hls', [Validators.required]),
      to: new FormControl('', [Validators.required]),
      toAddress: new FormControl('', [Validators.required]),
      from: new FormControl('', [Validators.required]),
      gasPrice: new FormControl('21000', [Validators.required])
    }, {
      validator: [this.isAddress('toAddress')]
    });
    try {
      this.secret = await this.secureStorage.getSecret();
      const contacts = await this.secureStorage.getStorage( 'contacts', this.secret );
      if ( contacts == null ) {
      this.contactsList = [];
    } else {
      this.contactsList = contacts;
    }
      const wallets = await this.secureStorage.getStorage( 'wallet' , this.secret);
      this.wallets = [];
      const loading = await this.loadingController.create({
          message: 'Please wait...',
          translucent: true,
          cssClass: 'custom-class custom-loading'
        });
      await loading.present();
      this.gasPrice = this.sendForm.value.gasPrice;
      const helios: any = await this.coingeckoService.getCoin(this.HELIOS_ID).toPromise();
      for (const wallet of wallets) {
          const balance = await this.heliosService.getBalance(wallet.address);
          this.currentPrice = helios.market_data.current_price.usd;
          const usd = Number(balance) * Number(this.currentPrice);
          this.wallets.push({
            address: wallet.address ,
            balance ,
            usd ,
            privateKey: wallet.privateKey
          });
        }
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

  async updateTotals() {
    if (this.sendForm.value.currency === 'hls') {
      this.totalHls = this.sendForm.value.amount || 0;
      this.totalUsd = Number(this.sendForm.value.amount) * Number(this.currentPrice);
    } else {
      this.totalUsd = this.sendForm.value.amount || 0;
      this.totalHls = Number(this.sendForm.value.amount)  / Number(this.currentPrice);
    }
    this.gasPrice = this.sendForm.value.gasPrice;
    this.totalHls = await this.heliosService.gasPriceSumAmount( this.totalHls , this.gasPrice );
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
    /*  const fromBalance = await this.heliosService.getBalance(transaction.from);
      if (fromBalance < this.sendForm.value.amount) {
        throw new Error('Insufficient funds.');
      }*/
      const userInfo = await this.secureStorage.getStorage( 'userInfo' , this.secret );
      if (userInfo) {
        const key = this.wallets.find(element => element.address === this.sendForm.value.from).privateKey;
        const bytes  = cryptoJs.AES.decrypt(key, userInfo.sessionHash);
        result = await this.heliosService.sendTransaction(transaction, bytes.toString(cryptoJs.enc.Utf8));
      } else {
        const userInfoLocal = await this.secureStorage.getStorage( 'userInfoLocal', this.secret );
        const key = this.wallets.find(element => element.address === this.sendForm.value.from).privateKey;
        const bytes  = cryptoJs.AES.decrypt(key, userInfoLocal.sessionHash);
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
  /*  if (result){
      this.modalController.dismiss(result);
    }*/
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

 async setBalanceToWallet(wallet:any){
  if(wallet!==undefined){
  this.wallet=wallet;
  this.globalWallet = await this.heliosService.getBalance(wallet);
  this.checkAvalaibleBalance();
 }}

  async checkAvalaibleBalance(){
  if(this.globalWallet<this.sendForm.value.amount||this.globalWallet==undefined || this.globalWallet <= this.totalHls){
      if ( this.globalWallet <= this.totalHls ) {
        const toast = await this.toastController.create({
          cssClass: 'text-red',
          message: 'Insufficient funds. Consider the gas commission to pay.',
          duration: 3000
        });
        toast.present();
      }
      this.isInvalid=true;
    }else{
      this.isInvalid=false;
    }
  }

}
