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
import { UserInfo } from 'src/app/entities/userInfo';


@Component({
  selector: 'app-generate',
  templateUrl: './generate.page.html',
  styleUrls: ['./generate.page.scss'],
})
export class GeneratePage implements OnInit {

  public createWallet: FormGroup;
  saltRounds: number;
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
    
  ) {
    this.saltRounds = 11;
  }

  ngOnInit() {

  
    this.createWallet = this.formBuilder.group({
      'password': new FormControl('', [Validators.required, Validators.minLength(16)]),
      'username': new FormControl('', [Validators.required]),
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
      const result = await this.heliosServersideService.signIn(this.createWallet.value.username, this.createWallet.value.password, null);
      const userInfo = new UserInfo(result.keystores, result.session_hash, result['2fa_enabled'], this.createWallet.value.username);
      this.storage.set('userInfo', userInfo);

      for (const keystoreInfo of userInfo.keystores) {
        const keystore = await this.heliosService.jsonToAccount(keystoreInfo.keystore, this.createWallet.value.password);
        this.wallets.push(new Wallet(
          keystore.address, cryptoJs.AES.encrypt(keystore.privateKey, result.session_hash).toString(), keystoreInfo.name)
        );
      }
      this.storage.set('wallet', this.wallets);

      const accountWallet = await this.heliosService.accountCreate(this.createWallet.value.password);
      const keystorage = accountWallet.encrypt;
      const storageUser = await this.storage.get('userInfo');
      if (storageUser) {
        await this.heliosServersideService.addOnlineWallet(keystorage, this.createWallet.value.name, storageUser);
        this.hash = storageUser.sessionHash;
      } else {
        this.hash = this.generateHash(this.createWallet.value.password);
        this.storage.set('userInfoLocal', { sessionHash: this.hash });
      }

      sessionStorage.setItem('wallet', accountWallet.account.address);
      sessionStorage.setItem('privateKey', accountWallet.account.privateKey);
      sessionStorage.setItem('keystore', JSON.stringify(accountWallet.encrypt));
      // data storage for mobile
      this.storage.get('wallet').then(async (wallets) => {
        try {

          if (wallets === null) {
            const walletArray = [new Wallet(accountWallet.account.address,
              cryptoJs.AES.encrypt(accountWallet.account.privateKey, this.hash).toString(), this.createWallet.value.name)];
            this.storage.set('wallet', walletArray);
          } else {
            wallets.push(new Wallet(accountWallet.account.address,
              cryptoJs.AES.encrypt(accountWallet.account.privateKey, this.hash).toString(), this.createWallet.value.name));
            this.storage.set('wallet', wallets);
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
      });
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

  generateHash(password: any) {
    const newSalt = bcrypt.genSaltSync(this.saltRounds);
    const newPasswordHash = bcrypt.hashSync(password, newSalt);
    return newPasswordHash;
  }
}
