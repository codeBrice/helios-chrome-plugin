import { Injectable } from '@angular/core';
import Web3 from 'web3';

@Injectable({
  providedIn: 'root'
})
export class HeliosServiceService {

  private web3: any;

  private availableNodes: any[];

  constructor() {
    this.availableNodes = [
      'wss://bootnode.heliosprotocol.io:30304',
      'wss://bootnode2.heliosprotocol.io:30304',
      'wss://bootnode3.heliosprotocol.io:30304',
      'wss://masternode1.heliosprotocol.io:30304'
    ];
  }

  async connectToFirstAvailableNode() {

    for (const node of this.availableNodes) {
        console.log('Connecting to node ' + node);
        this.web3 = new Web3(new Web3.providers.WebsocketProvider(node));

        const isListening = await this.web3.eth.net.isListening();
        const numPeers = await this.web3.eth.net.getPeerCount();
        console.log( ' listening: ' + isListening.toString() + ' with ' + numPeers + ' peers');

        if (this.isConnected()) {
            console.log('Successfully connected to ' + node);
            /* const balance = await this.web3.eth.getBalance('0x4A1383744eED3DBE37B7A0870b15FeA3cE319A66');
            console.log(balance); */
            return true;
        }
        console.log('Failed to connect to node ' + node);
    }
    return false;
  }

  private isConnected() {
    const connected = !(this.web3.currentProvider == null || !this.web3.currentProvider.connected);
    return connected;
  }

}
