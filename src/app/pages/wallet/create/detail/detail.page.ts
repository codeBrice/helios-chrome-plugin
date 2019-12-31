import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {

  helios_wallet: any;
  constructor() { }

  ngOnInit() {
    this.helios_wallet = sessionStorage.getItem('walletCreate');
  }

}
