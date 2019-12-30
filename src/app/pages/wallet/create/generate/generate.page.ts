import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-generate',
  templateUrl: './generate.page.html',
  styleUrls: ['./generate.page.scss'],
})
export class GeneratePage implements OnInit {

  public createWallet: FormGroup;

  constructor(
/*     private formBuilder: FormBuilder */
  ) { }

  ngOnInit() {
    /* this.createWallet = this.formBuilder.group({
      'password': ['', Validators.minLength(16), Validators.required]
    }); */
  }

}
