import { Injectable } from '@angular/core';
import Web3 from 'web3';
import * as Utils from 'web3-utils';
import {formatters} from 'web3-core-helpers';
import { HlsUtils } from '../utils/hls-utils';
import { Transaction } from '../entities/transaction';
import { Account } from '../entities/account';

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
      } , {
        name: 'getBlockByNumber',
        call: 'hls_getBlockByNumber',
        params: 3,
        inputFormatter: [(val) => val, (val) => val, (val) => !!val],
        outputFormatter: formatters.outputBlockFormatter
      } , {
        name: 'getTransactionByHash',
        call: 'hls_getTransactionByHash',
        params: 1,
        outputFormatter: formatters.outputTransactionFormatter
      }, {
        name: 'getTransactionReceipt',
        call: 'hls_getTransactionReceipt',
        params: 1,
        outputFormatter: formatters.outputTransactionReceiptFormatter
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
  async accountCreate(password: string) {
    try {
      console.log('accountsCreate');
      if (await this.isConnected()) {
        const preAccount = await this.web3.eth.accounts.create();
        const encrypt = await this.web3.eth.accounts.encrypt(preAccount.privateKey, password);
        const account = new Account(preAccount, encrypt);
        console.log(account);
        return account;
      } else {
        throw new Error('Fail Connect');
      }
    } catch (error) {
      throw error;
    }
  }

  async privateKeyToAccount(privateKey: string) {
    try {
      console.log('privateKeyToAccount');
      if (await this.isConnected()) {
        const account = await this.web3.eth.accounts.privateKeyToAccount(privateKey);
        console.log(account);
        // const encrypt = await this.web3.eth.accounts.encrypt(account.privateKey, '123');
        // console.log(JSON.stringify(encrypt));
        return account;
      } else {
        throw new Error('Fail Connect');
      }
    } catch (error) {
      throw error;
    }
  }

  async jsonToAccount(jsonAccount: string, password: string) {
    try {
      console.log('jsonAccount');
      const account = this.web3.eth.accounts.decrypt(JSON.parse(jsonAccount), password);
      // const encrypt = await this.web3.eth.accounts.encrypt(preAccount.privateKey, password);
      // const account = new Account(preAccount, encrypt);
      console.log(account);
      return account;
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
      console.log('getBalance');
      if (await this.isConnected()) {
        const balance = await this.web3.hls.getBalance(address);
        console.log(balance);
        return balance;
      } else {
        throw new Error('Fail Connect');
      }
    } catch (error) {
      throw error;
    }
  }

  /* async getTransaction(hash: string) {
    try {
      console.log('getTransaction');
      if (await this.isConnected()) {
        const transactionData = await this.web3.hls.getTransactionByHash(hash);
        console.log(transactionData);
        return Transaction;
      } else {
        throw new Error('Fail Connect');
      }
    } catch (error) {
      throw error;
    }
  } */

  /* async getTransactionReceipt(hash: string) {
    try {
      console.log('getTransaction');
      if (await this.isConnected()) {
        const transactionData = await this.web3.hls.getTransactionReceipt(hash);
        console.log(transactionData);
        return Transaction;
      } else {
        throw new Error('Fail Connect');
      }
    } catch (error) {
      throw error;
    }
  } */

  async getAllTransactions(address: string, startDate, endDate) {
    try {
      console.log('getAllTransactions');
      if (await this.isConnected()) {
        const startBlockNumber = await this.web3.hls.getBlockNumber(address, startDate);
        // console.log(startBlockNumber);
        const output = [];
        for (let i = startBlockNumber; i >= (startBlockNumber - 10); i--) {
          // console.log('Getting all transactions at block number ' + i);
          const newBlock = await this.web3.hls.getBlockByNumber(i, address, true);
          // console.log(newBlock);
          if (newBlock.timestamp > startDate) {
            continue;
          }
          if (newBlock.timestamp > endDate) {
              break;
          }
          if (newBlock.transactions.length > 0) {
              for (const transactionBlock of newBlock.transactions) {
                  const tx = transactionBlock;
                  output.push(new Transaction(newBlock.timestamp, 'Send transaction',
                    formatters.outputBigNumberFormatter(this.web3.utils.toBN(tx.value).mul(this.web3.utils.toBN(-1))),
                    formatters.outputBigNumberFormatter(this.web3.utils.toBN(tx.gasUsed)
                      .mul(this.web3.utils.toBN(tx.gasPrice)).mul(this.web3.utils.toBN(-1))),
                    tx.to, address, formatters.outputBigNumberFormatter(newBlock.accountBalance), newBlock.number));

              }
          }
          if (newBlock.receiveTransactions.length > 0) {
              for (const receiveTransactions of newBlock.receiveTransactions) {
                  const tx = receiveTransactions;
                  let description;
                  if (tx.isRefund === '0x0') {
                      description = 'Refund transaction';
                  } else {
                      description = 'Receive transaction';
                  }
                  output.push(new Transaction(newBlock.timestamp, description,
                    formatters.outputBigNumberFormatter(tx.value),
                    formatters.outputBigNumberFormatter(this.web3.utils.toBN(tx.gasUsed)
                      .mul(this.web3.utils.toBN(tx.gasPrice)).mul(this.web3.utils.toBN(-1))),
                    address, tx.from, formatters.outputBigNumberFormatter(newBlock.accountBalance), newBlock.number));
              }
          }
          if (parseFloat(newBlock.rewardBundle.rewardType1.amount) !== parseFloat('0')) {
              output.push(new Transaction(newBlock.timestamp, 'Reward type 1',
              formatters.outputBigNumberFormatter(newBlock.rewardBundle.rewardType1.amount), 0, address, 'Coinbase',
              formatters.outputBigNumberFormatter(newBlock.accountBalance), newBlock.number));
          }
          if (parseFloat(newBlock.rewardBundle.rewardType2.amount) !== parseFloat('0')) {
              output.push(new Transaction(newBlock.timestamp, 'Reward type 2',
              formatters.outputBigNumberFormatter(newBlock.rewardBundle.rewardType2.amount), 0, address, 'Coinbase',
              formatters.outputBigNumberFormatter(newBlock.accountBalance), newBlock.number));
          }
        }
        console.log(output);
        return output;
      } else {
        throw new Error('Fail Connect');
      }
    } catch (error) {
      throw error;
    }
  }


  /**
   * Determines whether connected is node
   * @returns  boolean
   */
  private async isConnected() {
    try {
      if (!(this.web3.currentProvider == null || !this.web3.currentProvider.connected)) {
        return true;
      } else {
        const connect = await this.connectToFirstAvailableNode();
        return connect;
      }
    } catch (error) {
      throw error;
    }
  }

}
