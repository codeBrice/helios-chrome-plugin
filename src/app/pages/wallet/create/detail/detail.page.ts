import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {

  generateWallet: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private clipboard: Clipboard,
    public toastController: ToastController,
    public alertController: AlertController,
    private router: Router,
    ) { }

  ngOnInit() {
    this.generateWallet = this.formBuilder.group({
      'privateKey': new FormControl(sessionStorage.getItem('privateKey')),
      'keystore': new FormControl(sessionStorage.getItem('keystore'))
    });
    //this.heliosWallet = sessionStorage.getItem('wallet');
  }

  private async  copy( formName: string)  {
    if ( formName === 'privateKey' ) {
      this.clipboard.copy( sessionStorage.getItem('privateKey') );
    } else {
      this.clipboard.copy( sessionStorage.getItem('keystore') );
    }
    const toast = await this.toastController.create({
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
            this.router.navigate(['/tabs/home']);
          }
        }
      ]
    });

    await alert.present();
  }
}
