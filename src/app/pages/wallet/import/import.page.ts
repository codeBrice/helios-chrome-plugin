import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { HeliosServiceService } from '../../../services/helios-service.service';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Wallet } from 'src/app/entities/wallet';
import bcrypt from 'bcryptjs';
import cryptoJs from 'crypto-js';
import { SecureStorage } from '../../../utils/secure-storage';

@Component({
  selector: 'app-import',
  templateUrl: './import.page.html',
  styleUrls: ['./import.page.scss'],
})
export class ImportPage implements OnInit {

  privateKey: boolean;
  keystore: boolean;
  importWallet: FormGroup;
  add: boolean;
  isCorrect = false;
  enableTouchIdFaceId = false;

  constructor(
    private formBuilder: FormBuilder,
    private heliosService: HeliosServiceService,
    private alertController: AlertController,
    private router: Router,
    private storage: Storage,
    private loadingController: LoadingController,
    public toastController: ToastController,
    private secureStorage: SecureStorage
  ) {}

  ngOnInit() {
    this.importWallet = this.formBuilder.group({
      privateKey: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(16)]),
      keystore: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required])
    });
  }

  changeRadio( value: string ) {
    this.privateKey = false;
    this.keystore = false;
    if ( value === 'privateKey' ) {
      this.privateKey = true;
      this.importWallet.controls.keystore.clearValidators();
      this.importWallet.controls.keystore.updateValueAndValidity();
      this.importWallet.controls.privateKey.setValidators([Validators.required]);
      this.importWallet.controls.privateKey.updateValueAndValidity();
    } else {
      this.keystore = true;
      this.importWallet.controls.privateKey.clearValidators();
      this.importWallet.controls.privateKey.updateValueAndValidity();
      this.importWallet.controls.keystore.setValidators([Validators.required]);
      this.importWallet.controls.keystore.updateValueAndValidity();
    }
  }

  async sendMethodImport() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    await loading.present();
    try {
          const secret = await this.secureStorage.getSecret();
          const wallets = await this.secureStorage.getStorage('wallet', secret);
          const hash = this.secureStorage.generateHash( this.importWallet.value.password );
          this.secureStorage.setStorage('userInfoLocal', { sessionHash: hash }, secret);
          if ( this.privateKey ) {
            const privateKey = await this.heliosService.privateKeyToAccount( this.importWallet.value.privateKey );
            const md5ToAvatar = cryptoJs.MD5(privateKey.address).toString();
            if ( wallets === null) {
              const walletArray = [new Wallet(privateKey.address, cryptoJs.AES.encrypt( privateKey.privateKey, hash ).toString(),
                this.importWallet.value.name, md5ToAvatar)];
              this.secureStorage.setStorage('wallet', walletArray, secret);
            } else {
              this.notRepeat(wallets, privateKey.address);
              wallets.push(new Wallet(privateKey.address, cryptoJs.AES.encrypt( privateKey.privateKey, hash ).toString(),
               this.importWallet.value.name, md5ToAvatar));
              this.secureStorage.setStorage('wallet', wallets, secret);
            }
          } else {
            const keystore = await this.heliosService.jsonToAccount( this.importWallet.value.keystore, this.importWallet.value.password );
            const md5ToAvatar = cryptoJs.MD5(keystore.address).toString();
            if ( wallets === null) {
            const walletArray = [new Wallet(keystore.address,
              cryptoJs.AES.encrypt( keystore.privateKey, hash ).toString() , this.importWallet.value.name, md5ToAvatar)];
            this.secureStorage.setStorage('wallet', walletArray, secret);
            } else {
              this.notRepeat(wallets, keystore.address);
              wallets.push(new Wallet(keystore.address, cryptoJs.AES.encrypt( keystore.privateKey, hash ).toString(),
               this.importWallet.value.name, md5ToAvatar));
              this.secureStorage.setStorage('wallet', wallets, secret);
            }
          }
          const alert = await this.alertController.create({
            header: 'Success!',
            message: '<strong>Successfully imported wallet</strong>',
            buttons: [
            {
                text: 'Continue',
                handler: () => {
                  sessionStorage.clear();
                  this.router.navigate(['/dashboard']);
                }
              }
            ]
          });
          await alert.present();
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

  /**
   * Nots repeat
   * @param wallets
   * @param address
   * @returns
   */
  notRepeat(wallets, address) {
    for (const wallet of wallets) {
      if (wallet.address === address) {
        throw new Error('Wallet Repeated');
      }
    }
    return true;
  }
}
