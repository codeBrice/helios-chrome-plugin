import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { SecureStorage } from '../../utils/secure-storage';
import { LoadingController, ToastController } from '@ionic/angular';
import { HeliosServersideService } from '../../services/helios-serverside.service';
import { HeliosServiceService } from '../../services/helios-service.service';
import { UserInfo } from '../../entities/UserInfo';
import cryptoJs from 'crypto-js';
import { Wallet } from '../../entities/wallet';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reload-singin',
  templateUrl: './reload-singin.page.html',
  styleUrls: ['./reload-singin.page.scss'],
})
export class ReloadSinginPage implements OnInit {

  reSignInForm: FormGroup;
  wallets: {}[] = [];

  constructor(private formBuilder: FormBuilder,
              private secureStorage: SecureStorage,
              private loadingController: LoadingController,
              private toastController: ToastController,
              private heliosServersideService: HeliosServersideService,
              private heliosService: HeliosServiceService,
              private router: Router
              ) { }

  ngOnInit() {
    this.reSignInForm = this.formBuilder.group({
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
      const userName = await this.secureStorage.getStorage('username' , secret );
      const result = await this.heliosServersideService.signIn(userName, this.reSignInForm.value.password, null);
      console.log('result del logeo', result);
      const userInfo = new UserInfo(result.session_hash, result['2fa_enabled'], userName, this.reSignInForm.value.password );

      for (const keystoreInfo of result.keystores) {
        const keystore = await this.heliosService.jsonToAccount( keystoreInfo.keystore, this.reSignInForm.value.password );
        const md5ToAvatar = cryptoJs.MD5(keystore.address).toString();
        this.wallets.push(new Wallet(
          keystore.address, cryptoJs.AES.encrypt( keystore.privateKey, result.session_hash).toString(), keystoreInfo.name,
           md5ToAvatar, keystoreInfo.id)
          );
      }
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

}
