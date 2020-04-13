import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { HeliosServersideService } from 'src/app/services/helios-serverside.service';
import { Storage } from '@ionic/storage';
import { ToastController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HeliosServiceService } from '../../../../services/helios-service.service';



@Component({
  selector: 'app-create-accounts',
  templateUrl: './create-accounts.page.html',
  styleUrls: ['./create-accounts.page.scss'],
})
export class CreateAccountsPage implements OnInit {

  createAccountForm: FormGroup;
  constructor(private formBuilder: FormBuilder,
    private heliosServersideService: HeliosServersideService,
    private storage: Storage,
    private router: Router,
    private heliosService: HeliosServiceService,
    private toastController: ToastController,
    private loadingController: LoadingController) { }

  ngOnInit() {
    this.createAccountForm = this.formBuilder.group({
      username: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(16)]),
      repeatPassword: new FormControl('', [Validators.required, Validators.minLength(16)])
    },
      { validator: this.matchingPasswords('password', 'repeatPassword') }
    );
  }
  matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
    return (group: FormGroup): { [key: string]: any } => {
      let password = group.controls[passwordKey];
      let confirmPassword = group.controls[confirmPasswordKey];

      if (password.value !== confirmPassword.value) {
        return {
          mismatchedPasswords: true
        };
      }
    }
  }

  async createNewAccount() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    await loading.present();

    try {
      //Method create wallet for user
      const accountWallet = await this.heliosService.accountCreate(this.createAccountForm.value.password);
      const keystorage = accountWallet.encrypt;
      const result = await this.heliosServersideService.newUser(this.createAccountForm.value.username, this.createAccountForm.value.email, this.createAccountForm.value.password, keystorage)
      if (result != null) {
        const toast = await this.toastController.create({
          cssClass: 'text-green',
          message:'Your account has been created successfully.',
          duration: 2000
        });
        toast.present();
        this.router.navigate(['/homewallet']);
      }

    } catch (error) {
      const toast = await this.toastController.create({
        cssClass: 'text-red',
        message: error.errorDescription || error.message,
        duration: 2000
      });
      toast.present();

    }
    await loading.dismiss();
  }

}
