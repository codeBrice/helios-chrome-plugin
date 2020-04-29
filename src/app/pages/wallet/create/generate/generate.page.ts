import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { HeliosServiceService } from '../../../../services/helios-service.service';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Wallet } from 'src/app/entities/wallet';
import bcrypt from 'bcryptjs';
import cryptoJs from 'crypto-js';
import { HeliosServersideService } from 'src/app/services/helios-serverside.service';
import { SecureStorage } from '../../../../utils/secure-storage';
import { UserInfo } from '../../../../entities/userInfo';

@Component({
  selector: 'app-generate',
  templateUrl: './generate.page.html',
  styleUrls: ['./generate.page.scss'],
})
export class GeneratePage implements OnInit {

  public createWallet: FormGroup;
  hash: string;
  wallets: {}[] = [];
  constructor(
   private formBuilder: FormBuilder,
   private heliosService: HeliosServiceService,
   private router: Router,
   private storage: Storage,
   private loadingController: LoadingController,
   public toastController: ToastController,
   private heliosServersideService: HeliosServersideService,
   private secureStorage: SecureStorage
  ) {}

  ngOnInit() {


    this.createWallet = this.formBuilder.group({
      password: new FormControl('', [Validators.required, Validators.minLength(16)]),
      username: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required])
    });

  }




  async sendPassword() {
    const loading = await this.loadingController.create({
      message: 'Creating wallet...',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    await loading.present();

    try {
      let walletCreate: {keystorage: any, accountWallet: any} = null;
      const secret = await this.secureStorage.getSecret();
      const storageUser = await this.secureStorage.getStorage('userInfo', secret);
      if (storageUser) {
        const result = await this.heliosServersideService.signIn(this.createWallet.value.username, this.createWallet.value.password, null);
        walletCreate = await this.createAccountWallet();
        await this.heliosServersideService.addOnlineWallet(walletCreate.keystorage, this.createWallet.value.name, storageUser);
        const resultSign = await this.heliosServersideService.signIn(this.createWallet.value.username,
          this.createWallet.value.password, null);
        const userInfo = new UserInfo(resultSign.session_hash, result['2fa_enabled'], this.createWallet.value.username);
        this.hash = userInfo.sessionHash;
        for (const keystoreInfo of resultSign.keystores) {
          const keystore = await this.heliosService.jsonToAccount(keystoreInfo.keystore, this.createWallet.value.password);
          const md5ToAvatar = cryptoJs.MD5(keystore.address).toString();
          this.wallets.push(new Wallet(
            keystore.address,
            cryptoJs.AES.encrypt(keystore.privateKey, this.hash).toString(),
            keystoreInfo.name,
            md5ToAvatar,
            keystoreInfo.id)
          );
        }
        this.secureStorage.setStorage('wallet', this.wallets, secret);
      } else {
        this.hash = this.secureStorage.generateHash( this.createWallet.value.password );
        walletCreate = await this.createAccountWallet();
        this.secureStorage.setStorage('userInfoLocal', {sessionHash: this.hash}, secret);

        try {
          const wallets = await this.secureStorage.getStorage('wallet', secret);
          console.log( 'wallets en el generate', wallets);
          const md5ToAvatar = cryptoJs.MD5(walletCreate.accountWallet.account.address).toString();
          if ( wallets === null) {
            const walletArray = [new Wallet(walletCreate.accountWallet.account.address,
              cryptoJs.AES.encrypt( walletCreate.accountWallet.account.privateKey, this.hash ).toString(),
              this.createWallet.value.name,
              md5ToAvatar, null)];
            this.secureStorage.setStorage('wallet', walletArray, secret);
          } else {
            wallets.push(new Wallet(walletCreate.accountWallet.account.address,
               cryptoJs.AES.encrypt( walletCreate.accountWallet.account.privateKey, this.hash ).toString(),
               this.createWallet.value.name,
               md5ToAvatar, null));
            this.secureStorage.setStorage('wallet', wallets, secret);
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
      sessionStorage.setItem( 'wallet', walletCreate.accountWallet.account.address );
      sessionStorage.setItem( 'privateKey', walletCreate.accountWallet.account.privateKey );
      sessionStorage.setItem( 'keystore', JSON.stringify(walletCreate.accountWallet.encrypt) );
      this.router.navigate(['/detailwallet']);
      await loading.dismiss();
        // data storage for mobile
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
  
  async createAccountWallet() {
    const accountWallet = await this.heliosService.accountCreate(this.createWallet.value.password);
    const keystorage = accountWallet.encrypt;
    console.log( 'keystorage y account wallet en generate page',{ keystorage, accountWallet } )
    return { keystorage, accountWallet };
  }
}

