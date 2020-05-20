import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController, ActionSheetController } from '@ionic/angular';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { SecureStorage } from 'src/app/utils/secure-storage';

@Component({
  selector: 'app-security-modal',
  templateUrl: './security-modal.page.html',
  styleUrls: ['./security-modal.page.scss'],
})
export class SecurityModalPage implements OnInit {

  configForm: FormGroup;
  whiteList: [];
  secret: string;

  constructor(private modalController: ModalController, private storage: Storage,
              private formBuilder: FormBuilder,
              private secureStorage: SecureStorage,
              public alertController: AlertController,
              public actionSheetController: ActionSheetController) {
  }

  async ngOnInit() {
    this.configForm = this.formBuilder.group({
      use: new FormControl('')
    });
    this.secret = await this.secureStorage.getSecret();
    const whiteList = await this.secureStorage.getStorage('whiteList', this.secret);
    this.whiteList = whiteList || [];
  }

  presentActionSheet(index: number, page) {
    this.alertController.create({
      header: 'Are you sure?',
      message: `Delete White Page <strong>${page}?</strong>`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Okay',
          handler: () => {
            this.whiteList.splice(index, 1);
            this.secureStorage.setStorage( 'whiteList', this.whiteList, this.secret );
          }
        }
      ]
    }).then((val) => val.present());
  }

  dismiss() {
    this.modalController.dismiss({
      dismissed: true
    });
  }
}
