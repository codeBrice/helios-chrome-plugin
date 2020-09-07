import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SecureStorage } from '../../../utils/secure-storage';

@Component({
  selector: 'app-send-modal',
  templateUrl: './receive-modal.page.html',
  styleUrls: ['./receive-modal.page.scss'],
})
export class ReceiveModalPage implements OnInit {

  elementType: 'url' | 'canvas' | 'img' = 'canvas';
  wallets: any;
  wallet:any;
  receiveForm: FormGroup;

  constructor(private modalController: ModalController, private formBuilder: FormBuilder,
              private storage: Storage, public toastController: ToastController, private secureStorage: SecureStorage) { }

  async ngOnInit() {

    this.receiveForm = this.formBuilder.group({
      address: new FormControl(''),

    });
    const secret  = await this.secureStorage.getSecret();
    const wallets = await this.secureStorage.getStorage( 'wallet' , secret );
    if ( wallets == null ) {
      this.wallets = []
    } else {
      this.wallets = wallets ;
    }
  }

  dismiss() {
    this.modalController.dismiss({
      dismissed: true
    });
  }

  async  copy( address: string)  {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = address;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);

    const toast = await this.toastController.create({
      cssClass: 'text-yellow',
      message: 'Copied.',
      duration: 2000
    });
    toast.present();
  }

  changeWallet(walletFromForm:string){
    this.wallet= walletFromForm;
  }
}
