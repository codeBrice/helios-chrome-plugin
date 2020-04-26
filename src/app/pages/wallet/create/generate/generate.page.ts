import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { HeliosServiceService } from '../../../../services/helios-service.service';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Wallet } from 'src/app/entities/wallet';
import bcrypt from 'bcryptjs';
import cryptoJs from 'crypto-js';
import { HeliosServersideService } from 'src/app/services/helios-serverside.service';
import { SecureStorage } from '../../../../utils/secure-storage';
import { UserInfo } from '../../../../entities/UserInfo';

@Component({
  selector: 'app-generate',
  templateUrl: './generate.page.html',
  styleUrls: ['./generate.page.scss'],
})
export class GeneratePage implements OnInit {

  public createWallet: FormGroup;
  hash: string;

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
      'password': new FormControl('', [Validators.required, Validators.minLength(16)]),
      'name': new FormControl('', [Validators.required])
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

        const accountWallet =  await this.heliosService.accountCreate( this.createWallet.value.password );
        const keystorage = accountWallet.encrypt;
        const secret = await this.secureStorage.getSecret();
        console.log('secret en generate page', secret);
        const storageUser = await this.secureStorage.getStorage('userInfo', secret);
        console.log( 'UserInfo en generate page', storageUser)
        if (storageUser) {
          await this.heliosServersideService.addOnlineWallet(keystorage, this.createWallet.value.name, storageUser);
          this.hash = storageUser.sessionHash;
        } else {
          this.hash = this.secureStorage.generateHash( this.createWallet.value.password );
          this.secureStorage.setStorage('userInfoLocal', {sessionHash: this.hash}, secret);
        }

        sessionStorage.setItem( 'wallet', accountWallet.account.address );
        sessionStorage.setItem( 'privateKey', accountWallet.account.privateKey );
        sessionStorage.setItem( 'keystore', JSON.stringify(accountWallet.encrypt) );
        // data storage for mobile
        try {
            const wallets = await this.secureStorage.getStorage('wallet', secret);
            const md5ToAvatar = cryptoJs.MD5(accountWallet.account.address).toString();
            if ( wallets === null) {
              const walletArray = [new Wallet(accountWallet.account.address,
                cryptoJs.AES.encrypt( accountWallet.account.privateKey, this.hash ).toString(), 
                this.createWallet.value.name,
                md5ToAvatar)];
              this.secureStorage.setStorage('wallet', walletArray, secret);
            } else {
              wallets.push(new Wallet(accountWallet.account.address,
                 cryptoJs.AES.encrypt( accountWallet.account.privateKey, this.hash ).toString(), 
                 this.createWallet.value.name,
                 md5ToAvatar));
              this.secureStorage.setStorage('wallet', wallets, secret);
            }
            this.router.navigate(['/detailwallet']);
          } catch (error) {
              const toast = await this.toastController.create({
                cssClass: 'text-red',
                message: error.message,
                duration: 2000
              });
              toast.present();
          }
        await loading.dismiss();
      } catch (error) {
        const toast = await this.toastController.create({
          cssClass: 'text-red',
          message: error.errorDescription || error.message,
          duration: 2000
        });
        toast.present();
      }
  }
}
