import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CoingeckoService {

  constructor(private http: HttpClient) { }

  private coin  = (idCoin) =>  `https://api.coingecko.com/api/v3/coins/${idCoin}`;
  private marketChart  = (idCoin) =>  `https://api.coingecko.com/api/v3/coins/${idCoin}/market_chart?vs_currency=usd&days=90`;

  getCoin(idCoin: string) {
    return this.http.get(this.coin(idCoin));
  }

  getMarketChart(idCoin: string) {
    return this.http.get(this.marketChart(idCoin));
  }
}
