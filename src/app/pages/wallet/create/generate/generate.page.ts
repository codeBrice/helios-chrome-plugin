import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { HeliosServiceService } from '../../../../services/helios-service.service';
import { Router } from '@angular/router';

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
  ) { }

  ngOnInit() {
    this.createWallet = this.formBuilder.group({
      'password': new FormControl('', [Validators.required, Validators.minLength(16)])
    });
  }

  async sendPassword(){
    const accountWallet =  await this.heliosService.accountCreate( this.createWallet.value.password );
    console.log('wallet',accountWallet.account.address)
    sessionStorage.setItem('walletCreate', accountWallet.account.address );
    this.router.navigate(['/detailwallet']);
    //console.log( 'object account front', accountWallet);
  }
}
