import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-security-modal',
  templateUrl: './security-modal.page.html',
  styleUrls: ['./security-modal.page.scss'],
})
export class SecurityModalPage {

  configForm: FormGroup;
  config: any;

  isCorrect = false;
  enableTouchIdFaceId = false;

  constructor(private modalController: ModalController, private storage: Storage,
              private formBuilder: FormBuilder) {

    this.configForm = this.formBuilder.group({
      use: new FormControl('')
    });
  }

  dismiss() {
    this.modalController.dismiss({
      dismissed: true
    });
  }
}
