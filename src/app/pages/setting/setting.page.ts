import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ContactsModalPage } from './contacts-modal/contacts-modal.page';
import { SecurityModalPage } from './security-modal/security-modal.page';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
})
export class SettingPage implements OnInit {

  constructor(private modalController: ModalController, private socialSharing: SocialSharing) { }

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
    this.socialSharing.share('Optional title', 'Optional message', 'http://www.myurl.com');
  }

  help() {
    window.open('https://heliosprotocol.io/', '_system');
  }
}
