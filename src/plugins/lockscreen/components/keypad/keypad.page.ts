import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TapticEngine } from '@ionic-native/taptic-engine/ngx';
import { Storage } from '@ionic/storage';

const DEFAULT_THEME_COLOR = 'helios';
const PASSCODE_LENGTH = 6;
@Component({
  selector: 'app-keypad',
  templateUrl: './keypad.page.html',
  styleUrls: ['./keypad.page.scss'],
  host: {
    '(document:keydown)': 'handleKeyboardEvent($event)'
  }
})
export class KeypadPage {
  themeColor: string = DEFAULT_THEME_COLOR;
  inputCombination = '';
  dots: any[] = [];
  isIncorrect = false;
  isRetry = false;
  originalPasscode: string;
  @Input() passcode: string;
  @Input() enableTouchId: boolean;
  @Input() newPasscode: boolean;

  constructor(private modalCtrl: ModalController, private taptic: TapticEngine, private storage: Storage) {
  }

  ionViewWillEnter() {
    for (let i = 0; i < PASSCODE_LENGTH; i++) {
      this.dots.push({
        active: false
      });
    }
  }

  add(number: number) {
    if (this.inputCombination.length < PASSCODE_LENGTH) {
      this.inputCombination += '' + number;
      this.updateDots();

      if (this.inputCombination.length === PASSCODE_LENGTH) {
        if (this.newPasscode === true && !this.originalPasscode) {
          this.isRetry = true;
          this.originalPasscode = this.inputCombination;
          this.inputCombination = '';
          this.updateDots();
        } else if (this.isRetry &&  this.originalPasscode) {
          this.verify();
        } else {
          this.verify();
        }
      }
    }
  }

  delete() {
    if (this.inputCombination.length > 0) {
      this.inputCombination = this.inputCombination.slice(0, -1);
      this.updateDots();
    }
  }

  clear() {
    this.inputCombination = '';
    this.updateDots();
  }

  verify() {
    if (this.isRetry &&  this.inputCombination === this.originalPasscode) {
      this.isRetry = false;
      this.storage.set( 'passcode', { passcode: this.inputCombination , use: true } );
      console.log('CORRECT PASSCODE!');
      this.dismiss();
    } else if (this.inputCombination === this.passcode) {
      console.log('CORRECT PASSCODE!');
      this.dismiss();
    } else {
      this.isIncorrect = true;
      this.taptic.notification({type: 'error'});
      setTimeout(() => {
        this.clear();
        this.isIncorrect = false;
      }, 1000);
    }
  }

  updateDots() {
    for (let i = 0; i < this.dots.length; i++) {
      this.dots[i].active = i < this.inputCombination.length ? true : false;
    }
  }

  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key.match(/[0-9]/i)) {
      this.add(parseInt(event.key));
    } else if (event.key === 'Backspace') {
      this.delete();
    }
  }

  cancel() {
    this.modalCtrl.dismiss({
      type: 'cancel'
    });
  }

  dismiss() {
    this.modalCtrl.dismiss({
      type: 'dismiss',
      data: true
    });
  }

}
