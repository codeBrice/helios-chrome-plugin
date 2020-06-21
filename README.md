# Helios-chrome-plugin
___
Google chrome extension for helios wallet.

### Building locally
___
* Install Node.js (version 10.18.1)
* npm install in `\myApp` folder 
* Build the project to the `\myApp` folder with `ionic build --prod` once compiled use `webpack --config webpack.dev.js`
once installed and compiled you should go to the extensions section in google chrome and enable developer mode and select 
the unzipped load button and choose the `\www`  in your project folder and finally you will have the functional extension.

### How to call the extension from a web page
___
* `helios.enable()` To enable the extension on your website
* `helios.selectedAddress()` select user default wallet
* example of sending transaction with waiting for response. `from:` is the address of the user who will send the helios. 
`to:`is the address of the user who will receive the helios. `value:` amount of helios that will travel in the transaction.
~~~
helios.send({
    from: helios.selectedAddress(),
    to: '0x07D62a36D35261AfEcF6cb89382D393a398edc2c',
    value: 10
  })
~~~
* example of sending transaction without waiting for responses. `from:` is the address of the user who will send the helios. 
`to:`is the address of the user who will receive the helios. `value:` amount of helios that will travel in the transaction. 
~~~
helios.sendAsync({
    from: helios.selectedAddress(),
    to: '0x07D62a36D35261AfEcF6cb89382D393a398edc2c',
    value: 10
  })
~~~

### Other functions that websites can call
___
* `helios.ping()`
* `helios.getProtocolVersion()`
* `helios.getBlockByHash(param)`
* `helios.getGasPrice()`
* `helios.getTransactionReceipt(param)`
* `helios.getTransactionByHash()`
* `helios.getBalance(param)`
* `helios.getReceivableTransactions(param)`
* `helios.getFaucet(param)`
* `helios.getConnectedNodes()`
* `helios.getHistoricalGasPrice()`
* `helios.getApproximateHistoricalNetworkTPCCapability()`
* `helios.getApproximateHistoricalTPC()`
* `helios.sendRewardBlock(param)`  
For more information on the methods, [read the web 3 documentation](https://web3js.readthedocs.io/en/v1.2.9/)

### Development
___
`npm install`
`ionic build --prod`
`webpack --config webpack.dev.js`

### Built with
___
* Angular ( version 8.2.14)
* Ionic (version 5.4.16)
* Node.js (version 10.18.1)

### Author
___
**Helios Protocol**

