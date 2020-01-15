import { Component, OnInit, } from '@angular/core';
import { createChart, CrosshairMode } from 'lightweight-charts';
import { Platform, LoadingController } from '@ionic/angular';
import { CoingeckoService } from 'src/app/services/coingecko.service';
import * as moment from 'moment';
/* declare var TradingView: any; */
@Component({
  selector: 'app-setting',
  templateUrl: './chart.page.html',
  styleUrls: ['./chart.page.scss'],
})

export class ChartPage implements OnInit {

  helios: any;

  constructor(
    private loadingController: LoadingController,
    private platform: Platform,
    private coingeckoService: CoingeckoService) {

      platform.ready().then(async (readySource) => {

      const loading = await this.loadingController.create({
        message: 'Please wait...',
        translucent: true,
        cssClass: 'custom-class custom-loading'
      });
      await loading.present();

      this.helios = await this.coingeckoService.getMarketChart(this.HELIOS_ID).toPromise();
      // console.log(this.helios);

      const priceChart = this.getPriceChart();
      // console.log(priceChart);

      const chart = createChart(document.getElementById('chart'),
        { width: this.platform.width(),
          height: this.platform.height() - 130,
          crosshair: {
            mode: CrosshairMode.Normal,
          },
          layout: {
            backgroundColor: '#000000',
            textColor: '#ffff'
          },
          grid: {
            vertLines: {
                color: 'rgba(70, 130, 180, 0.5)',
                style: 1,
                visible: true,
            },
            horzLines: {
                color: 'rgba(70, 130, 180, 0.5)',
                style: 1,
                visible: true,
            },
          },
        });
      const lineSeries = chart.addCandlestickSeries();

      lineSeries.setData(priceChart);
      lineSeries.applyOptions({
        priceFormat: {
          type: 'custom',
          formatter: (price) => {
              return '$' + price.toFixed(9);
          },
        },
      });

      await loading.dismiss();

    });
  }

  private readonly HELIOS_ID = 'helios-protocol';

  ngOnInit() {
    /* new TradingView.widget(
      {
      symbol: 'NASDAQ:AAPL',
      interval: 'D',
      timezone: 'Etc/UTC',
      theme: 'Light',
      style: '1',
      locale: 'en',
      toolbar_bg: '#f1f3f6',
      enable_publishing: false,
      allow_symbol_change: true,
      container_id: 'tradingview_ebb56'
    }
      ); */
  }

  /**
   * Gets price chart
   * @returns array { time, open, high, low, close }
   */
  private getPriceChart() {
    let day = null;
    let open = null;
    let high = null;
    let low = null;
    let close = null;
    let time = null;
    const dataChart = [];
    let pricesDays = [];
    for (const price of this.helios.prices) {
      if (day === null) {
        day = price[0];
        time = moment(price[0]).format('YYYY-MM-DD');
        console.log(time);
        open = price[1];
        pricesDays.push(price[1]);
      } else {
        if (moment(day).isSame(price[0], 'day')) {
          pricesDays.push(price[1]);
        } else {
          close = price[1];
          high = Math.max(...pricesDays);
          low = Math.min(...pricesDays);
          dataChart.push({ time, open, high, low, close });
          day = price[0];
          time = moment(price[0]).format('YYYY-MM-DD');
          open = price[1];
          pricesDays = [];
          pricesDays.push(price[1]);
        }
      }
    }
    const last = this.helios.prices[this.helios.prices.length - 1];
    close = last[1];
    high = Math.max(...pricesDays);
    low = Math.min(...pricesDays);
    dataChart.push({ time, open, high, low, close });
    return dataChart;
  }

}
