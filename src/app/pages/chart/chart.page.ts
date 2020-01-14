import { Component, OnInit, } from '@angular/core';
import { createChart, CrosshairMode } from 'lightweight-charts';
import { Platform } from '@ionic/angular';
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

  constructor(platform: Platform,
    private coingeckoService: CoingeckoService) {
    platform.ready().then(async (readySource) => {

      this.helios = await this.coingeckoService.getMarketChart(this.HELIOS_ID).toPromise();
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
            dataChart.push({ time, open, high, low, close  });
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
      dataChart.push({ time, open, high, low, close  });

      console.log(dataChart);
      const chart = createChart(document.getElementById('chart'),
        { width: platform.width(),
          height: platform.height() - 130,
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

      /* var volumeSeries = chart.addHistogramSeries({
        color: '#26a69a',
        lineWidth: 2,
        priceFormat: {
          type: 'volume',
        },
        overlay: true,
        scaleMargins: {
          top: 0.8,
          bottom: 0,
        },
      });
      volumeSeries.setData([
        { time: '2019-04-15', value: 7741472.00, color: 'rgba(255,82,82, 0.8)' },
        { time: '2019-04-16', value: 10239261.00, color: 'rgba(0, 150, 136, 0.8)' },
        { time: '2019-04-17', value: 15498037.00, color: 'rgba(255,82,82, 0.8)' },
        { time: '2019-04-18', value: 13189013.00, color: 'rgba(0, 150, 136, 0.8)' },
        { time: '2019-04-22', value: 11950365.00, color: 'rgba(0, 150, 136, 0.8)' },
        { time: '2019-04-23', value: 23488682.00, color: 'rgba(255,82,82, 0.8)' },
        { time: '2019-04-24', value: 13227084.00, color: 'rgba(255,82,82, 0.8)' },
        { time: '2019-04-25', value: 17425466.00, color: 'rgba(255,82,82, 0.8)' },
        { time: '2019-04-26', value: 16329727.00, color: 'rgba(0, 150, 136, 0.8)' },
        { time: '2019-04-29', value: 13984965.00, color: 'rgba(0, 150, 136, 0.8)' },
        { time: '2019-04-30', value: 15469002.00, color: 'rgba(0, 150, 136, 0.8)' },
        { time: '2019-12-01', value: 11627436.00, color: 'rgba(255,82,82, 0.8)' },
        { time: '2019-12-02', value: 14435436.00, color: 'rgba(0, 150, 136, 0.8)' },
        { time: '2019-12-03', value: 9388228.00, color: 'rgba(0, 150, 136, 0.8)' },
        { time: '2019-12-06', value: 10066145.00, color: 'rgba(255,82,82, 0.8)' },
        { time: '2019-12-07', value: 12963827.00, color: 'rgba(255,82,82, 0.8)' },
        { time: '2019-12-08', value: 12086743.00, color: 'rgba(255,82,82, 0.8)' },
        { time: '2019-12-09', value: 14835326.00, color: 'rgba(0, 150, 136, 0.8)' },
        { time: '2019-12-10', value: 10707335.00, color: 'rgba(0, 150, 136, 0.8)' },
        { time: '2019-12-13', value: 13759350.00, color: 'rgba(255,82,82, 0.8)' },
        { time: '2019-12-14', value: 12776175.00, color: 'rgba(255,82,82, 0.8)' },
        { time: '2019-12-15', value: 10806379.00, color: 'rgba(0, 150, 136, 0.8)' },
        { time: '2019-12-16', value: 11695064.00, color: 'rgba(0, 150, 136, 0.8)' },
        { time: '2019-12-17', value: 14436662.00, color: 'rgba(0, 150, 136, 0.8)' },
        { time: '2019-12-20', value: 20910590.00, color: 'rgba(0, 150, 136, 0.8)' },
        { time: '2019-12-21', value: 14016315.00, color: 'rgba(0, 150, 136, 0.8)' },
        { time: '2019-12-22', value: 11487448.00, color: 'rgba(255,82,82, 0.8)' },
        { time: '2019-12-23', value: 11707083.00, color: 'rgba(255,82,82, 0.8)' },
        { time: '2019-12-24', value: 8755506.00, color: 'rgba(0, 150, 136, 0.8)' },
        { time: '2019-12-28', value: 3097125.00, color: 'rgba(0, 150, 136, 0.8)' },
        { time: '2019-01-01', value: 10942737.00, color: 'rgba(0, 150, 136, 0.8)' },
        { time: '2019-01-04', value: 13674737.00, color: 'rgba(255,82,82, 0.8)' },
        { time: '2019-01-05', value: 15749545.00, color: 'rgba(255,82,82, 0.8)' },
        { time: '2019-01-06', value: 13935530.00, color: 'rgba(255,82,82, 0.8)' },
        { time: '2019-01-07', value: 12644171.00, color: 'rgba(0, 150, 136, 0.8)' },
        { time: '2019-01-08', value: 10646710.00, color: 'rgba(0, 150, 136, 0.8)' },
        { time: '2019-01-11', value: 13627431.00, color: 'rgba(0, 150, 136, 0.8)' },
        { time: '2019-01-12', value: 12812980.00, color: 'rgba(255,82,82, 0.8)' },
        { time: '2019-01-13', value: 14168350.00, color: 'rgba(0, 150, 136, 0.8)' },
        { time: '2019-01-14', value: 12148349.00, color: 'rgba(0, 150, 136, 0.8)' },
      ]); */
      lineSeries.setData(dataChart);
      lineSeries.applyOptions({
        priceFormat: {
          type: 'custom',
          formatter: (price) => {
              return '$' + price.toFixed(9);
          },
        },
    });
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

}
