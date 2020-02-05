import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { Contact } from 'src/app/entities/contact';
import { CoingeckoService } from 'src/app/services/coingecko.service';
import { HeliosServiceService } from 'src/app/services/helios-service.service';

@Component({
  selector: 'app-send-modal',
  templateUrl: './send-modal.page.html',
  styleUrls: ['./send-modal.page.scss'],
})
export class SendModalPage implements OnInit {

  constructor(private modalController: ModalController, private formBuilder: FormBuilder,
              private storage: Storage, private loadingController: LoadingController,
              private coingeckoService: CoingeckoService, private heliosService: HeliosServiceService) { }

  sendForm: FormGroup;
  contactsList: Contact[];
  wallets: any;
  currentPrice: number;
  gasPrice: number;
  totalHls = 0;
  totalUsd = 0;

  private readonly HELIOS_ID = 'helios-protocol';

  ngOnInit() {
    this.sendForm = this.formBuilder.group({
      amount: new FormControl('', [Validators.required, Validators.min(1)]),
      currency: new FormControl('hls', [Validators.required]),
      to: new FormControl('', [Validators.required]),
      from: new FormControl('', [Validators.required])
    });

    this.storage.get( 'contacts').then(contacts => {
      this.contactsList = contacts || [];
     });

    this.storage.get('wallet').then(async (wallets) => {
        this.wallets = [];
        const loading = await this.loadingController.create({
          message: 'Please wait...',
          translucent: true,
          cssClass: 'custom-class custom-loading'
        });
        await loading.present();
        this.gasPrice = await this.heliosService.getGasPrice();
        const helios: any = await this.coingeckoService.getCoin(this.HELIOS_ID).toPromise();
        for (const wallet of wallets) {
          const balance = await this.heliosService.getBalance(wallet);
          this.currentPrice = helios.market_data.current_price.usd;
          const usd = Number(balance) * Number(this.currentPrice);
          this.wallets.push({
            address: wallet ,
            balance ,
            usd
          });
        }
        await loading.dismiss();

    });
  }

  updateTotals() {
    if (this.sendForm.value.currency === 'hls') {
      this.totalHls = this.sendForm.value.amount || 0;
      this.totalUsd = Number(this.sendForm.value.amount) * Number(this.currentPrice);
    } else {
      this.totalUsd = this.sendForm.value.amount || 0;
      this.totalHls = Number(this.sendForm.value.amount)  / Number(this.currentPrice);
    }
  }

  async send() {
    const transaction = {
      from: this.sendForm.value.from,
      to: this.sendForm.value.to,
      // value: web3.utils.toWei('1337', 'ether'),
      value: this.sendForm.value.amount,
      gas: 21000,
      gasPrice: this.heliosService.toWei(String(this.gasPrice))
    };
    await this.heliosService.sendTransaction(transaction);
  }

  dismiss() {
    this.modalController.dismiss({
      dismissed: true
    });
  }
}
