import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { HeliosServersideService } from 'src/app/services/helios-serverside.service';
import { LoadingController, ToastController } from '@ionic/angular';
import { UserInfo } from 'src/app/entities/userInfo';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { HeliosServiceService } from 'src/app/services/helios-service.service';
import { Wallet } from 'src/app/entities/wallet';
import cryptoJs from 'crypto-js';
import { SecureStorage } from '../../../utils/secure-storage';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  loginForm: FormGroup;
  isCorrect = false;
  enableTouchIdFaceId = false;
  wallets: {}[] = [];

  constructor(private formBuilder: FormBuilder,
              private heliosServersideService: HeliosServersideService,
              private loadingController: LoadingController,
              public toastController: ToastController,
              private router: Router,
              private heliosService: HeliosServiceService,
              private secureStorage: SecureStorage) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(16)],)
    });
  }

  async login() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    await loading.present();
    try {
      const secret = await this.secureStorage.getSecret();
      const result = await this.heliosServersideService.signIn(this.loginForm.value.username, this.loginForm.value.password, null);
      const userInfo = new UserInfo(result.session_hash, result['2fa_enabled'], this.loginForm.value.username,
       this.loginForm.value.password);

      for (const keystoreInfo of result.keystores) {
        const keystore = await this.heliosService.jsonToAccount( keystoreInfo.keystore, this.loginForm.value.password );
        const md5ToAvatar = cryptoJs.MD5(keystore.address).toString();
        this.wallets.push(new Wallet(
          keystore.address, cryptoJs.AES.encrypt( keystore.privateKey, result.session_hash).toString(), keystoreInfo.name,
           md5ToAvatar, keystoreInfo.id)
          );
      }
      this.secureStorage.setStorage('username', this.loginForm.value.username, secret);
      this.secureStorage.setStorage('userInfo', userInfo, secret);
      this.secureStorage.setStorage('wallet', this.wallets, secret);
      this.router.navigate(['/dashboard']);
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

  offline() {
    this.router.navigate(['/add']);
  }

}
