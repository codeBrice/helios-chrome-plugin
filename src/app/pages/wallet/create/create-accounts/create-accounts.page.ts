import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-create-accounts',
  templateUrl: './create-accounts.page.html',
  styleUrls: ['./create-accounts.page.scss'],
})
export class CreateAccountsPage implements OnInit {

  createAccountForm: FormGroup;
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    //Falta agregar  que las contraseñas coincidan y chequear que el  metodo revise que el usuario no exista en base de datos
    this.createAccountForm = this.formBuilder.group({
      username: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      repeatPassword: new FormControl('', [Validators.required])
    });
  }

}
