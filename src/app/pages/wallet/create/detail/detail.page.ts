import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

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
    public toastController: ToastController,
    public alertController: AlertController,
    private router: Router,
    private _route: ActivatedRoute
    ) { }

  ngOnInit() {
    this.generateWallet = this.formBuilder.group({
      privateKey: new FormControl(''),
      keystore: new FormControl('')
    });
    this._route.params.subscribe(params => {
      this.generateWallet.value.privateKey = params['privatekey'];
      this.generateWallet.value.keystore = params['keystore'];
    });
  }

  async  copy( formName: string)  {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    if ( formName === 'privateKey' ) {
      selBox.value = sessionStorage.getItem('privateKey');
    } else {
      selBox.value = sessionStorage.getItem('keystore');
    }
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);

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
            this.router.navigate(['/dashboard']);
          }
        }
      ]
    });

    await alert.present();
  }

}
