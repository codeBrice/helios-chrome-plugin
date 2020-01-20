import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { HeliosServiceService } from '../../../../services/helios-service.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-generate',
  templateUrl: './generate.page.html',
  styleUrls: ['./generate.page.scss'],
})
export class GeneratePage implements OnInit {

  public createWallet: FormGroup;

  constructor(
   private formBuilder: FormBuilder,
   private heliosService: HeliosServiceService,
   private router: Router,
   private storage: Storage,
   private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.createWallet = this.formBuilder.group({
      'password': new FormControl('', [Validators.required, Validators.minLength(16)])
    });
  }

  async sendPassword(){
      const loading = await this.loadingController.create({
        message: 'Creating wallet...',
        translucent: true,
        cssClass: 'custom-class custom-loading'
      });
      await loading.present();

      const accountWallet =  await this.heliosService.accountCreate( this.createWallet.value.password );
      sessionStorage.setItem( 'wallet', accountWallet.account.address );
      sessionStorage.setItem( 'privateKey', accountWallet.account.privateKey );
      sessionStorage.setItem( 'keystore', JSON.stringify(accountWallet.encrypt) );
      // data storage for mobile
      this.storage.get( 'wallet').then(async (wallets) => {
        if ( wallets === null) {
          const walletArray = [accountWallet.account.address];
          this.storage.set( 'wallet', walletArray );
        } else {
          wallets.push(accountWallet.account.address);
          this.storage.set( 'wallet', wallets );
        }
        this.router.navigate(['/detailwallet']);
        await loading.dismiss();
      });
  }
}
