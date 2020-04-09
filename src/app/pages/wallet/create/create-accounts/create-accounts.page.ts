import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { HeliosServersideService } from 'src/app/services/helios-serverside.service';
import { Storage } from '@ionic/storage';
import { ToastController } from '@ionic/angular';
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
    private toastController: ToastController) { }

  ngOnInit() {
    //Falta agregar  que las contraseñas coincidan y chequear que el  metodo revise que el usuario no exista en base de datos
    this.createAccountForm = this.formBuilder.group({
      username: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(16)]),
      repeatPassword: new FormControl('', [Validators.required, Validators.minLength(16)])
    }
    );
  }


  async createNewAccount() {

    try {
      //Method create wallet for user
      const accountWallet = await this.heliosService.accountCreate(this.createAccountForm.value.password);
      const keystorage = accountWallet.encrypt;
      const result = await this.heliosServersideService.newUser(this.createAccountForm.value.username, this.createAccountForm.value.email, this.createAccountForm.value.password, keystorage)
      this.router.navigate(['/homewallet']);
    } catch (error) {
      const toast = await this.toastController.create({
        cssClass: 'text-red',
        message: error.message,
        duration: 2000
      });
      toast.present();

    }

  }

}
