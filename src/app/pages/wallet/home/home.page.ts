import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { HeliosServersideService } from 'src/app/services/helios-serverside.service';
import { LoadingController, ToastController } from '@ionic/angular';
import { UserInfo } from 'src/app/entities/UserInfo';
import { Storage } from '@ionic/storage';
import { LockscreenService } from 'src/plugins/lockscreen/services/lockscreen.service';
import { Router } from '@angular/router';
import { HeliosServiceService } from 'src/app/services/helios-service.service';
import { Wallet } from 'src/app/entities/wallet';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  loginForm: FormGroup;
  isCorrect = false;
  enableTouchIdFaceId = false;

  constructor(private formBuilder: FormBuilder,
              private heliosServersideService: HeliosServersideService,
              private loadingController: LoadingController,
              public toastController: ToastController,
              private storage: Storage,
              private lockscreenService: LockscreenService,
              private router: Router,
              private heliosService: HeliosServiceService) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
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
      const result = await this.heliosServersideService.signIn(this.loginForm.value.username, this.loginForm.value.password, null);
      const userInfo = new UserInfo(result.success, result.keystores, result.session_hash, result['2fa_enabled']);
      this.storage.set( 'userInfo', userInfo );

      const wallets = [];
      for (const keystoreInfo of userInfo.keystores) {
        const keystore = await this.heliosService.jsonToAccount( keystoreInfo.keystore, this.loginForm.value.password );
        wallets.push(new Wallet(keystore.address, keystore.privateKey, keystoreInfo.name));
      }
      this.storage.set( 'wallet', wallets );

      this.showLockscreen();
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

  showLockscreen() {
    this.storage.get( 'passcode').then(storageData => {
      if (!storageData) {
        const options = {
          passcode: null,
          enableTouchIdFaceId: this.enableTouchIdFaceId,
          newPasscode: true
        };
        this.lockscreenService.verify(options)
          .then((response: any) => {
            const { data } = response;
            console.log('Response from lockscreen service: ', data);
            if (data.type === 'dismiss') {
              this.isCorrect = data.data;
              this.router.navigate(['/tabs/home']);
            } else {
              this.isCorrect = false;
            }
          });
      } else {
        this.router.navigate(['/tabs/home']);
      }
    });
  }
}
