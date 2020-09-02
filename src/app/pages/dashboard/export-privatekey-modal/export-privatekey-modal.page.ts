import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { SecureStorage } from 'src/app/utils/secure-storage';
import { ModalController, ToastController,LoadingController,AlertController } from '@ionic/angular';
import { HeliosServersideService } from 'src/app/services/helios-serverside.service';
import { HeliosServiceService } from '../../../services/helios-service.service';
import { Wallet } from 'src/app/entities/wallet';
import cryptoJs from 'crypto-js';
import { UserInfo } from 'src/app/entities/userInfo';
import { Router } from '@angular/router';

@Component({
  selector: 'app-export-privatekey-modal',
  templateUrl: './export-privatekey-modal.page.html',
  styleUrls: ['./export-privatekey-modal.page.scss'],
})
export class ExportPrivatekeyModalPage implements OnInit {
  exportPrivateKey:FormGroup;
  isReadOnly: boolean;
  secret: any;
  wallets: {}[] = [];
  constructor(private formBuilder: FormBuilder,
              private secureStorage: SecureStorage,
              private modalController: ModalController,
              private loadingController: LoadingController,
              private heliosServersideService:HeliosServersideService,
              private heliosService: HeliosServiceService,
              public toastController: ToastController,
              private router:Router,
              private alertController:AlertController) { }

 async  ngOnInit() {
    this.exportPrivateKey = this.formBuilder.group({
      password: new FormControl('', [Validators.required, Validators.minLength(16)]),
      username: new FormControl('', [Validators.required]),
    });
    this.secret = await this.secureStorage.getSecret();
    const userInfo = await this.secureStorage.getStorage('userInfo', this.secret);
    this.isReadOnly = true;
    this.exportPrivateKey.get('username').setValue( userInfo.userName );
    }
  

   async viewPrivateKey(){
    console.log('EXPORTpvkey');
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    await loading.present();

    try{
      const result = await this.heliosServersideService.signIn(this.exportPrivateKey.value.username,
        this.exportPrivateKey.value.password, null);
      const secret = await this.secureStorage.getSecret();
      const userInfo = new UserInfo(result.session_hash, result['2fa_enabled'], this.exportPrivateKey.value.username,
        this.exportPrivateKey.value.password);
      this.secureStorage.setStorage('userInfo', userInfo, secret);
      for (const keystoreInfo of result.keystores) {
          const keystore = await this.heliosService.jsonToAccount( keystoreInfo.keystore, this.exportPrivateKey.value.password );
          const md5ToAvatar = cryptoJs.MD5(keystore.address).toString();
          this.wallets.push(new Wallet(
            keystore.address, cryptoJs.AES.encrypt( keystore.privateKey, result.session_hash).toString(), keystoreInfo.name,
             md5ToAvatar, keystoreInfo.id)
            );
        }
      this.secureStorage.setStorage('wallet', this.wallets, secret);
      const defaultWallet = await this.secureStorage.getStorage('defaultWallet', this.secret);
      if (defaultWallet != null ) {
      const privateKey = '0x' + cryptoJs.AES.decrypt( defaultWallet.privateKey, result.session_hash ).toString();
      this.router.navigate(['/export-privatekey/'+privateKey]);
      } else {
          const alert = await this.alertController.create({
            header: 'Confirm!',
            message: '<strong>Sorry for the inconvenience try again please.</strong>',
            buttons: [
              {
                text: 'Continue',
                handler: () => {
                  this.router.navigate(['/dashboard']);
                }
              }
            ]
          });
          await alert.present();
        }

          } catch (error) {
        const toast = await this.toastController.create({
            cssClass: 'text-red',
            message: error.errorDescription || error.message,
            duration: 2000
          });
        toast.present();
      }
    await loading.dismiss();
    this.dismiss();
    }

    dismiss() {
      this.modalController.dismiss(false);
    }
}
