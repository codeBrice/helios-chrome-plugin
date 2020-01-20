import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-security-modal',
  templateUrl: './security-modal.page.html',
  styleUrls: ['./security-modal.page.scss'],
})
export class SecurityModalPage{

  constructor(private modalController: ModalController) { }

  dismiss() {
    this.modalController.dismiss({
      dismissed: true
    });
  }
}
