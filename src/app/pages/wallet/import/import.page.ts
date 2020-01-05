import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { HeliosServiceService } from '../../../services/helios-service.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-import',
  templateUrl: './import.page.html',
  styleUrls: ['./import.page.scss'],
})
export class ImportPage implements OnInit {

  privateKey: boolean;
  keystore: boolean;
  importWallet: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private heliosService: HeliosServiceService,
    private alertController: AlertController,
    private router: Router,
    private storage: Storage
  ) { }

  ngOnInit() {
    this.importWallet = this.formBuilder.group({
      'privateKey': new FormControl('', [Validators.required]),
      'password': new FormControl('', [Validators.required, Validators.minLength(16)]),
      'keystore': new FormControl('', [Validators.required])
    });
  }

  changeRadio( value: string ) {
    this.privateKey = false;
    this.keystore = false;
    if( value === 'privateKey' ) {
      this.privateKey = true;
      this.importWallet.controls['keystore'].clearValidators();
      this.importWallet.controls['keystore'].updateValueAndValidity();
      this.importWallet.controls['password'].clearValidators();
      this.importWallet.controls['password'].updateValueAndValidity();

      this.importWallet.controls['privateKey'].setValidators([Validators.required]);
      this.importWallet.controls['privateKey'].updateValueAndValidity();
    } else {
      this.keystore = true;
      this.importWallet.controls['privateKey'].clearValidators();
      this.importWallet.controls['privateKey'].updateValueAndValidity();

      this.importWallet.controls['password'].setValidators([Validators.required, Validators.minLength(16)]);
      this.importWallet.controls['password'].updateValueAndValidity();
      this.importWallet.controls['keystore'].setValidators([Validators.required]);
      this.importWallet.controls['keystore'].updateValueAndValidity();
    }
  }

  async sendMethodImport(){
    if ( this.privateKey ) {
      const privateKey = await this.heliosService.privateKeyToAccount( this.importWallet.value.privateKey );
      this.storage.set( 'wallet', privateKey.address );
    } else {
      const keystore = await this.heliosService.jsonToAccount( this.importWallet.value.keystore, this.importWallet.value.password );
      this.storage.set( 'wallet', keystore.address );
    }
    const alert = await this.alertController.create({
      header: 'Success!',
      message: '<strong>Successfully imported wallet</strong>',
      buttons: [
      {
          text: 'Continue',
          handler: () => {
            sessionStorage.clear();
            this.router.navigate(['/tabs/home']);
          }
        }
      ]
    });
    await alert.present();
  }
}
