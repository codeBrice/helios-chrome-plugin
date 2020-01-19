import { Component, Input } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-transaction-detail-modal',
  templateUrl: './transaction-detail-modal.page.html',
  styleUrls: ['./transaction-detail-modal.page.scss'],
})
export class TransactionDetailModalPage{
  @Input() transactionDetail: any;

  constructor( private modalController: ModalController, navParams: NavParams) { 
    this.transactionDetail = navParams.get('transactionDetail');
  }
  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }
}
