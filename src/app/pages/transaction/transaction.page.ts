import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { Storage } from '@ionic/storage';
import { HeliosServiceService } from '../../services/helios-service.service';
import { LoadingController, ModalController } from '@ionic/angular';
import { TransactionDetailModalPage } from '../transactionDetail/transaction-detail-modal/transaction-detail-modal.page';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.page.html',
  styleUrls: ['./transaction.page.scss'],
})
export class TransactionPage implements OnInit {
  fromTx: any;
  toTx: any;
  transactions: any[] = [];
  constructor(
    private heliosService: HeliosServiceService,
    private storage: Storage,
    private loadingController: LoadingController,
    private modalController: ModalController,
    ) { }

  ngOnInit() {
    let startDate = moment().utc().subtract(3, 'months').valueOf();
    let endDate = moment().utc().valueOf();

    this.storage.get('wallet').then(async (wallets) => {
      const loading = await this.loadingController.create({
        message: 'Please wait...',
        translucent: true,
        cssClass: 'custom-class custom-loading'
      });
      await loading.present();
      this.fromTx = 0;
      this.toTx = 10;
      for (const wallet of wallets) {
          const tx = await this.heliosService.getAllTransactions( wallet , startDate , endDate, this.fromTx, this.toTx);
          this.transactions = tx.map( data => {
            data.timestamp = moment.unix(data.timestamp);
            return data;
          });
          console.log ( 'getTransactions', tx );
      }
      await loading.dismiss();
    });
  }

  doRefresh(event) {
    setTimeout(() => {
      event.target.complete();
      this.ngOnInit();
    }, 2000);
  }

  async presentModal( transaction: any ) {
    const modal = await this.modalController.create({
      component: TransactionDetailModalPage,
      componentProps: {
        transactionDetail: transaction,      }
    });
    return await modal.present();
  }

  loadTransaction( event ) {
    let startDate = moment().utc().subtract(3, 'months').valueOf();
    let endDate = moment().utc().valueOf();
    this.fromTx = this.fromTx + 11 ;
    this.toTx = this.toTx + 10;
    this.storage.get('wallet').then(async (wallets) => {
      for (const wallet of wallets) {
          const tx = await this.heliosService.getAllTransactions( wallet , startDate , endDate, this.fromTx, this.toTx);
          this.transactions = this.transactions.concat(tx.map( data => {
            data.timestamp = moment.unix(data.timestamp);
            return data;
          }));
          console.log ( 'getTransactions', this.transactions );
      }
      event.target.complete();
    });
  }
}