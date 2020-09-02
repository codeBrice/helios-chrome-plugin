import { Component, OnInit } from '@angular/core';
import {ToastController,LoadingController } from '@ionic/angular';
import { FormControl,FormBuilder, FormGroup } from '@angular/forms';
import { SecureStorage } from 'src/app/utils/secure-storage';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-export-privatekey',
  templateUrl: './export-privatekey.page.html',
  styleUrls: ['./export-privatekey.page.scss'],
})
export class ExportPrivatekeyPage implements OnInit {
  detailPrivateKey:FormGroup;
  secret:any;
  constructor(public toastController: ToastController,private formBuilder: FormBuilder,private secureStorage: SecureStorage,
    private _route: ActivatedRoute) { }

 async ngOnInit() {
    console.log('inicio exportpkkeydetail');
    this.detailPrivateKey = this.formBuilder.group({
      privateKey: new FormControl('')
    });
    this._route.params.subscribe(params => {
      this.detailPrivateKey.value.privateKey = params['privatekey'];
    });
  }

  
  async  copy( formName: string)  {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.detailPrivateKey.value.privateKey;
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

}
