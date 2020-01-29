import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ContactsModalPage } from './contacts-modal/contacts-modal.page';
import { SecurityModalPage } from './security-modal/security-modal.page';


@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
})
export class SettingPage implements OnInit {

  constructor(private modalController: ModalController) { }

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
}
