import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { LockscreenService } from 'src/plugins/lockscreen/services/lockscreen.service';

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
              private formBuilder: FormBuilder, private lockscreenService: LockscreenService) {

    this.configForm = this.formBuilder.group({
      use: new FormControl('')
    });

    /* this.storage.get( 'passcode').then(storageData => {
      this.config = storageData;
      this.configForm.controls.use.setValue(this.config.use);
    }); */
  }

  dismiss() {
    this.modalController.dismiss({
      dismissed: true
    });
  }

 /*  use() {
    this.config.use = this.configForm.value.use;
    this.storage.set( 'passcode', this.config);
    if (this.config.use === true) {
      this.showLockscreen();
    }
  } */

  showLockscreen() {
    this.dismiss();
    const options = {
      passcode: null,
      enableTouchIdFaceId: this.enableTouchIdFaceId,
      newPasscode: true
    };
    this.lockscreenService.verify(options)
      .then((response: any) => {
        const { data } = response;
        console.log('Response from lockscreen service: ', data);
        if (data.type === 'dismiss') {
          this.isCorrect = data.data;
        } else {
          this.isCorrect = false;
        }
      });
  }
}
