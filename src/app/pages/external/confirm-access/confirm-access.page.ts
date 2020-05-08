import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { HeliosServiceService } from 'src/app/services/helios-service.service';

@Component({
  selector: 'app-confirm-access',
  templateUrl: './confirm-access.page.html',
  styleUrls: ['./confirm-access.page.scss'],
})
export class ConfirmAccessPage implements OnInit {

  queryParams: Params;

  constructor( private activatedRoute: ActivatedRoute,
               private heliosService: HeliosServiceService) {
    this.activatedRoute.queryParams.subscribe( params => {
      this.queryParams = params;
    });
   }

  ngOnInit() {
  }

  access() {
    console.log('access' , this.queryParams);
    // background
    chrome.runtime.sendMessage('', {
      type: 'access'
    });
    // contentscript
    chrome.tabs.sendMessage(Number(this.queryParams.id) as number, {
      type: 'access',
      address: '0x610DA3BA540A9B316451DB1bD5950d37205be6ec'
    });
  }
}
