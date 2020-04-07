import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { LockscreenService } from 'src/plugins/lockscreen/services/lockscreen.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {

  generateWallet: FormGroup;
  isCorrect = false;
  enableTouchIdFaceId = false;

  constructor(
    private formBuilder: FormBuilder,
    private clipboard: Clipboard,
    public toastController: ToastController,
    public alertController: AlertController,
    private router: Router,
    private lockscreenService: LockscreenService
    ) { }

  ngOnInit() {
    this.generateWallet = this.formBuilder.group({
      privateKey: new FormControl(sessionStorage.getItem('privateKey')),
      keystore: new FormControl(sessionStorage.getItem('keystore'))
    });
  }

  async  copy( formName: string)  {
    if ( formName === 'privateKey' ) {
      this.clipboard.copy( sessionStorage.getItem('privateKey') );
    } else {
      this.clipboard.copy( sessionStorage.getItem('keystore') );
    }
    const toast = await this.toastController.create({
      cssClass: 'text-yellow',
      message: 'Copied.',
      duration: 2000
    });
    toast.present();
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: '<strong>Are you sure you have backed up your private key and keystore? If you have not done so, you could lose all your coins if you lose your device.</strong>!!!',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: 'Yes',
          handler: () => {
            sessionStorage.clear();
            //this.showLockscreen();
            this.router.navigate(['/tabs/home']);
          }
        }
      ]
    });

    await alert.present();
  }

  showLockscreen() {
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
            this.router.navigate(['/tabs/home']);
          } else {
            this.isCorrect = false;
          }
        });
  }
}
