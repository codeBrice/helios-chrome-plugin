import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Clipboard } from '@ionic-native/clipboard/ngx';

@Component({
  selector: 'app-send-modal',
  templateUrl: './receive-modal.page.html',
  styleUrls: ['./receive-modal.page.scss'],
})
export class ReceiveModalPage implements OnInit {

  elementType: 'url' | 'canvas' | 'img' = 'canvas';
  wallets: any;
  receiveForm: FormGroup;

  constructor(private modalController: ModalController, private formBuilder: FormBuilder,
              private storage: Storage, private clipboard: Clipboard, public toastController: ToastController) { }

  ngOnInit() {

    this.receiveForm = this.formBuilder.group({
      address: new FormControl(''),
    });

    this.storage.get('wallet').then(async (wallets) => {
      this.wallets = wallets || [];
    });
  }

  dismiss() {
    this.modalController.dismiss({
      dismissed: true
    });
  }

  async  copy( address: string)  {
    this.clipboard.copy( address );
    const toast = await this.toastController.create({
      message: 'Copied.',
      duration: 2000
    });
    toast.present();
  }
}
