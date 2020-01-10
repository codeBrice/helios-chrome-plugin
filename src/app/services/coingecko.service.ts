import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CoingeckoService {

  constructor(private http: HttpClient) { }

  private coin  = (idCoin) =>  `https://api.coingecko.com/api/v3/coins/${idCoin}`;

  getCoin(idCoin: String) {
    return this.http.get(this.coin(idCoin));
  }
}
