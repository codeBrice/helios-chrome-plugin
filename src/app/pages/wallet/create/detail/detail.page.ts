import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {

  generateWallet: FormGroup;
  constructor(private formBuilder: FormBuilder,
    private clipboard: Clipboard,
    public toastController: ToastController) { }

  ngOnInit() {
    this.generateWallet = this.formBuilder.group({
      'privateKey': new FormControl(sessionStorage.getItem('privateKey')),
      'keystore': new FormControl(sessionStorage.getItem('keystore'))
    });
    //this.heliosWallet = sessionStorage.getItem('wallet');
  }

  private async  copy (formName: string) {
    this.clipboard.copy(sessionStorage.getItem(formName));
    const toast = await this.toastController.create({
      message: 'Copied.',
      duration: 2000
    });
    toast.present();
  }
}
