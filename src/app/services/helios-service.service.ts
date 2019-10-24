import { Injectable } from '@angular/core';
import Web3 from 'web3';
import * as Utils from 'web3-utils';
import {formatters} from 'web3-core-helpers';
import { HlsUtils } from '../utils/hls-utils';

@Injectable({
  providedIn: 'root'
})
export class HeliosServiceService {

  private web3: any;

  private availableNodes: any[] = [
    'wss://bootnode.heliosprotocol.io:30304',
    'wss://bootnode2.heliosprotocol.io:30304',
    'wss://bootnode3.heliosprotocol.io:30304',
    'wss://masternode1.heliosprotocol.io:30304'
  ];

  private methods = {
    property: 'hls',
    methods: [
      {
        name: 'getBalance',
        call: 'hls_getBalance',
        params: 2,
        inputFormatter: [formatters.inputAddressFormatter, formatters.inputDefaultBlockNumberFormatter],
        outputFormatter: formatters.outputBigNumberFormatter
      }, {
        name: 'getBlockNumber',
        call: 'hls_getBlockNumber',
        params: 2,
        inputFormatter: [formatters.inputAddressFormatter, HlsUtils.inputTimestampFormatter],
        outputFormatter: Utils.hexToNumber
      }, {
        name: 'getTransactionByHash',
        call: 'hls_getTransactionByHash',
        params: 1,
        outputFormatter: HlsUtils.outputTransactionFormatter
      }
    ]
  };

  constructor() {
  }

  /**
   * Connects to first available node.
   * @returns  true : Successfully connected  or Error Failed to connect.
   */
  async connectToFirstAvailableNode() {
    try {
      for (const node of this.availableNodes) {
          console.log(`Connecting to node ${node}`);
          this.web3 = new Web3(new Web3.providers.WebsocketProvider(node));
          this.web3.extend(this.methods);
          // console.log(this.web3);
          const isListening = await this.web3.eth.net.isListening();
          const numPeers = await this.web3.eth.net.getPeerCount();
          // console.log( ' listening: ' + isListening.toString() + ' with ' + numPeers + ' peers');
          if (this.isConnected()) {
              console.log(`Successfully connected to ${node}`);
              return true;
          }
          throw new Error(`Failed to connect to node ${node}`);
      }
    } catch (error) {
      throw error;
    }
  }


  /**
   * Accounts create.
   * @returns  account
   * {
   *  address: "0xb8CE9ab6943e0eCED004cDe8e3bBed6568B2Fa01",
   *  privateKey: "0x348ce564d427a3311b6536bbcff9390d69395b06ed6c486954e971d960fe8709",
   *  signTransaction: function(tx){...},
   *  sign: function(data){...},
   *  encrypt: function(password){...}
   * }
   */
  async accountCreate() {
    try {
      console.log('accountsCreate Connected?', this.isConnected());
      if (this.isConnected()) {
        const account = await this.web3.eth.accounts.create();
        console.log(account);
        return account;
      } else {
        const connect = await this.connectToFirstAvailableNode();
        if (connect && this.isConnected()) {
          const account = await this.web3.eth.accounts.create();
          console.log(account);
          return account;
        }
      }
    } catch (error) {
      throw error;
    }
  }


  /**
   * Gets balance
   * @param address  example : 0x9c8b20E830c0Db83862892Fc141808eA6a51FEa2
   * @returns  balance string
   */
  async getBalance(address: string) {
    try {
      console.log('getBalance Connected?', this.isConnected());
      if (this.isConnected()) {
        const balance = await this.web3.hls.getBalance(address);
        console.log(balance);
        return balance;
      } else {
        const connect = await this.connectToFirstAvailableNode();
        if (connect && this.isConnected()) {
          const balance = await this.web3.hls.getBalance(address);
          console.log(balance);
          return balance;
        }
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Gets transaction
   * @param hash example: 0x6bc56e50ad6776793be1c2b001d1798404f58e1c794bd013d5288e62226a68bf
   * @returns  transaction
   * {
   *  "hash": "0x9fc76417374aa880d4449a1f7f31ec597f00b1f6f3dd2d66f4c9c6c445836d8b",
   *  "nonce": 2,
   *  "blockHash": "0xef95f2f1ed3ca60b048b4bf67cde2195961e0bba6f70bcbea9a2c4e133e34b46",
   *  "blockNumber": 3,
   *  "transactionIndex": 0,
   *  "from": "0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b",
   *  "to": "0x6295ee1b4f6dd65047762f924ecd367c17eabf8f",
   *  "value": '123450000000000000',
   *  "gas": 314159,
   *  "gasPrice": '2000000000000',
   *  "input": "0x57cb2fc4"
   * }
   */
  async getTransaction(hash: string) {
    try {
      console.log('getTransaction Connected?', this.isConnected());
      if (this.isConnected()) {
        const transaction = await this.web3.hls.getTransactionByHash(hash);
        console.log(transaction);
        return transaction;
      } else {
        const connect = await this.connectToFirstAvailableNode();
        if (connect && this.isConnected()) {
          const transaction = await this.web3.hls.getTransactionByHash(hash);
          console.log(transaction);
          return transaction;
        }
      }
    } catch (error) {
      throw error;
    }
  }


  /**
   * Determines whether connected is node
   * @returns  boolean
   */
  private isConnected() {
    try {
      return !(this.web3.currentProvider == null || !this.web3.currentProvider.connected);
    } catch (error) {
      throw error;
    }
  }

}
