import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor( private storage: Storage ) { }

  ngOnInit() {
     // Or to get a key/value pair
  this.storage.get('wallet').then((val) => {
    console.log('Your wallet is', val);
  });
  }

}
