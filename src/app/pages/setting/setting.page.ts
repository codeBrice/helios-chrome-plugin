import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { ContactsModalPage } from './contacts-modal/contacts-modal.page';
import { SecurityModalPage } from './security-modal/security-modal.page';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
})
export class SettingPage implements OnInit {

  constructor(private modalController: ModalController,
              private socialSharing: SocialSharing,
              private storage: Storage,
              private router: Router,
              public alertController: AlertController) { }

  ngOnInit() {
  }

  async presentModalSecurity() {
      const modal = await this.modalController.create({
        component: SecurityModalPage,
      });
      return await modal.present();
  }

  async presentModalContacts() {
    const modal = await this.modalController.create({
      component: ContactsModalPage,
    });
    return await modal.present();
  }

  share() {
    this.socialSharing.share('Helios Wallet Mobile: ', null, null, 'https://heliosprotocol.io/');
  }

  help() {
    window.open('https://heliosprotocol.io/', '_system');
  }

  terms() {
    window.open('https://heliosprotocol.io/terms_of_service.php', '_system');
  }

  async loginOut() {
    const alert = await this.alertController.create({
      header: 'Login Out',
      message: `<strong>Are you sure?</strong> all local wallet data will be lost.`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Okay',
          handler: () => {
            this.storage.clear();
            this.storage.set( 'tutorial', true );
            this.router.navigate(['/homewallet']);
          }
        }
      ]
    });
    await alert.present();

  }
}
