import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { HeliosServiceService } from '../../../services/helios-service.service';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Wallet } from 'src/app/entities/wallet';
import cryptoJs from 'crypto-js';
import { SecureStorage } from '../../../utils/secure-storage';
import { HeliosServersideService } from '../../../services/helios-serverside.service';
import { UserInfo } from '../../../entities/UserInfo';

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
  secret: any;
  isLocal: boolean = false;
  walletArray: {}[] = [];
  hash: any;
  importedWallet: boolean = false;
  isReadOnly: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private heliosService: HeliosServiceService,
    private alertController: AlertController,
    private router: Router,
    private storage: Storage,
    private loadingController: LoadingController,
    public toastController: ToastController,
    private secureStorage: SecureStorage,
    private heliosServersideService: HeliosServersideService
  ) { }

  async ngOnInit() {
    console.log('import wallet');
    this.importWallet = this.formBuilder.group({
      privateKey: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(16)]),
      keystore: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required])
    });
    this.secret = await this.secureStorage.getSecret();
    const userInfo = await this.secureStorage.getStorage('userInfo', this.secret);
    if (userInfo == null) {
      this.isLocal = true;
      this.importWallet.get('username').disable();
    } else {
      this.isReadOnly = true;
      this.importWallet.get('username').setValue( userInfo.userName );
    }
  }

  changeRadio(value: string) {
    this.privateKey = false;
    this.keystore = false;
    if (value === 'privateKey') {
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
      if (this.isLocal) {
        const userInfoLocal = await this.secureStorage.getStorage('userInfoLocal', secret );
        if ( userInfoLocal == null ) {
          this.hash = this.secureStorage.generateHash( this.importWallet.value.password );
        } else {
          this.hash = userInfoLocal.sessionHash;
        }
        this.secureStorage.setStorage('userInfoLocal', { sessionHash: this.hash }, secret);
      } else {
        const result = await this.heliosServersideService.signIn(this.importWallet.value.username,
          this.importWallet.value.password, null);
        const userInfo = new UserInfo(result.session_hash, result['2fa_enabled'], this.importWallet.value.username,
        this.importWallet.value.password);
        this.secureStorage.setStorage('userInfo', userInfo, secret);
      }
      if (this.privateKey) {
        if (!this.isLocal) {
          const privateKey = await this.heliosService.privateKeyToAccount(this.importWallet.value.privateKey,
            this.importWallet.value.password);
          const result = await this.secureStorage.getStorage('userInfo', this.secret);
          await this.heliosServersideService.addOnlineWallet(privateKey, this.importWallet.value.name, result, this.importedWallet);
          const resultSign = await this.heliosServersideService.signIn(this.importWallet.value.username,
            this.importWallet.value.password, null);
          const userInfo = new UserInfo(resultSign.session_hash, result['2fa_enabled'], this.importWallet.value.username,
          this.importWallet.value.password);
          this.secureStorage.setStorage('userInfo', userInfo, secret);
          for (const keystoreInfo of resultSign.keystores) {
            const keystore = await this.heliosService.jsonToAccount(keystoreInfo.keystore, this.importWallet.value.password);
            const md5ToAvatar = cryptoJs.MD5(keystore.address).toString();
            this.walletArray.push(new Wallet(keystore.address,
              cryptoJs.AES.encrypt(keystore.privateKey, resultSign.session_hash).toString(),
              keystoreInfo.name,
              md5ToAvatar,
              keystoreInfo.id)
            );
            this.secureStorage.setStorage('wallet', this.walletArray, secret);
          }
        } else {
          const privateKey = await this.heliosService.privateKeyToAccount(this.importWallet.value.privateKey, null);
          const md5ToAvatar = cryptoJs.MD5(privateKey.address).toString();
          if (wallets === null) {
            const walletArray = [new Wallet(privateKey.address, cryptoJs.AES.encrypt(privateKey.privateKey, this.hash).toString(),
              this.importWallet.value.name, md5ToAvatar, privateKey.id)];
            this.secureStorage.setStorage('wallet', walletArray, secret);
          } else {
            this.notRepeat(wallets, privateKey.address);
            wallets.push(new Wallet(privateKey.address, cryptoJs.AES.encrypt(privateKey.privateKey, this.hash).toString(),
              this.importWallet.value.name, md5ToAvatar, privateKey.id));
            this.secureStorage.setStorage('wallet', wallets, secret);
          }
        }
      } else {
        if (!this.isLocal) {
          this.importedWallet = true;
          const keystore = await this.heliosService.jsonToAccount(this.importWallet.value.keystore,
            this.importWallet.value.password);
          this.notRepeat(wallets, keystore.address);
          const storageUser = await this.secureStorage.getStorage('userInfo', this.secret);
          await this.heliosServersideService.addOnlineWallet(this.importWallet.value.keystore,
            this.importWallet.value.name, storageUser, this.importedWallet);
          const resultSign = await this.heliosServersideService.signIn(this.importWallet.value.username,
            this.importWallet.value.password, null);
          const userInfo = new UserInfo(resultSign.session_hash, resultSign['2fa_enabled'], this.importWallet.value.username,
          this.importWallet.value.password);
          await this.secureStorage.setStorage('userInfo', userInfo, secret);
          for (const keystoreInfo of resultSign.keystores) {
            const keystore = await this.heliosService.jsonToAccount(keystoreInfo.keystore, this.importWallet.value.password);
            const md5ToAvatar = cryptoJs.MD5(keystore.address).toString();
            this.walletArray.push(new Wallet(
              keystore.address,
              cryptoJs.AES.encrypt(keystore.privateKey, resultSign.session_hash).toString(),
              keystoreInfo.name,
              md5ToAvatar,
              keystoreInfo.id)
            );
          }
          this.secureStorage.setStorage('wallet', this.walletArray, secret);
        } else {
          const keystore = await this.heliosService.jsonToAccount(this.importWallet.value.keystore, this.importWallet.value.password);
          const md5ToAvatar = cryptoJs.MD5(keystore.address).toString();
          if (wallets === null) {
            const walletArray = [new Wallet(keystore.address,
              cryptoJs.AES.encrypt(keystore.privateKey, this.hash).toString(), this.importWallet.value.name, md5ToAvatar, keystore.id)];
            this.secureStorage.setStorage('wallet', walletArray, secret);
          } else {
            this.notRepeat(wallets, keystore.address);
            wallets.push(new Wallet(keystore.address, cryptoJs.AES.encrypt(keystore.privateKey, this.hash).toString(),
              this.importWallet.value.name, md5ToAvatar, keystore.id));
            this.secureStorage.setStorage('wallet', wallets, secret);
          }
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
        message: error.errorDescription || error.message,
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
