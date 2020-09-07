import Web3 from 'helios-web3';



declare global {
    interface Window { helios: any; }
    interface Window { ethereum: any; }
    interface Window { web3: any; }
}

const availableNodes: any[] = [
    'wss://bootnode.heliosprotocol.io:30304',
    'wss://bootnode2.heliosprotocol.io:30304',
    'wss://bootnode3.heliosprotocol.io:30304',
    'wss://masternode1.heliosprotocol.io:30304'
  ];
let helios: any;
console.log('web3');

// methods in contentscript
const enable = () => {
  const event = new CustomEvent('initHeliosApp');
  document.dispatchEvent(event);
};

const send = (tx) => {
  const result = document.getElementById('hlsAd');
  if (result) {
    const event = new CustomEvent('sendHelios', {detail: tx});
    document.dispatchEvent(event);
  } else {
    console.error('Helios not Enable');
  }
};




const sendAsync = async (tx) => {
  const result = document.getElementById('hlsAd');
  if (result) {
    const event = new CustomEvent('sendHelios', {detail: tx});
    document.dispatchEvent(event);

    return await new Promise(resolve => {
      const interval = setInterval(() => {
        const hlsStatus = document.getElementById('hlsStatus');
        if (hlsStatus) {
            const status = hlsStatus.innerText;
            hlsStatus.remove();
            clearInterval(interval);
            resolve((status === 'true'));
        }
      }, 5000);
    });

  } else {
    console.error('Helios not Enable');
  }
};

const selectedAddress = () => {
  const result = document.getElementById('hlsAd');
  if (result) {
    return result.innerText;
  }
  return null;
};

async function connectToFirstAvailableNode() {
  console.log(`connectToFirstAvailableNode`);
  try {
    if (helios && !(helios.currentProvider == null || !helios.currentProvider.connected)) {
      return true;
    } else {
      for (const node of availableNodes) {
          console.log(`Connecting to node ${node}`);
          helios = new Web3(new Web3.providers.WebsocketProvider(node));
          // console.log(helios);
          try {
            const listen = await helios.eth.net.isListening();
            // await helios.eth.net.getPeerCount();
            if (isConnected() || listen) {
                console.log(`Successfully connected to ${node}`);
                const objecExport = { send,
                  sendAsync,
                  enable ,
                  selectedAddress,
                  getBalance,
                  getProtocolVersion,
                  getHistoricalGasPrice,
                  getConnectedNodes,
                  getApproximateHistoricalNetworkTPCCapability,
                  getApproximateHistoricalTPC,
                  getFaucet,
                  getBlockByHash,
                  getTransactionReceipt,
                  getTransactionByHash,
                  getReceivableTransactions,
                  sendRawBlock,
                  getGasPrice,
                  ping
                };
                window.helios = objecExport;
                window.ethereum = objecExport;
                window.web3 = objecExport;
                return true;
            }
          } catch ( error ) {
            console.log(`Failed connected to ${node}`);
          }
          // console.log( ' listening: ' + isListening.toString() + ' with ' + numPeers + ' peers');
      }
      throw new Error('Failed to connect to nodes');
    }
  } catch (error) {
    throw error;
  }
}

async function isConnected() {
  try {
    if (helios && !(helios.currentProvider == null || !helios.currentProvider.connected)) {
      return true;
    } else {
      const connect = await connectToFirstAvailableNode();
      return connect;
    }
  } catch (error) {
    throw error;
  }
}

  const getBalance = async (tx) =>  {
  try {
    console.log('balance')
    //  const address=selectedAddress();
     // if(address!=null){
      return await helios.hls.getBalance(tx)|| helios.eth.getBalance(tx);
  } catch (error) {
    console.log(error);
    throw new Error('Failed to get balance');
  }
};


const getProtocolVersion = async () =>  {
  try {
    console.log('protocol Version')
    if( await isConnected()){
      return  await await helios.hls.getProtocolVersion() || helios.eth.getProtocolVersion();
    } 
  } catch (error) {
    console.log(error);
    throw new Error('Failed to get balance');
  }
};
const getGasPrice = async () =>  {
  try {
    console.log('get gas price')
    if( await isConnected()){
      return  await await helios.hls.getGasPrice() || helios.eth.getGasPrice();
    } 
  } catch (error) {
    console.log(error);
    throw new Error('Failed to get gas price');
  }
};

const ping = async () =>  {
  try {
    console.log('get ping ')
    if( await isConnected()){
      return  await await helios.hls.ping() || helios.eth.ping();
    } 
  } catch (error) {
    console.log(error);
    throw new Error('Failed to get ping');
  }
};

const getHistoricalGasPrice = async () =>  {
  try {
    console.log('getHistoricalGasPrice')
    if( await isConnected()){
      return await helios.hls.getHistoricalGasPrice() || helios.eth.getHistoricalGasPrice();
    } 
  } catch (error) {
    console.log(error);
    throw new Error('Failed to get historical gas price');
  }
};


const getConnectedNodes = async () =>  {
  try {
    console.log('getConnectedNodes')
    if( await isConnected()){
      return await helios.hls.getConnectedNodes() || helios.eth.getConnectedNodes();
    } 
  } catch (error) {
    console.log(error);
    throw new Error('Failed to get connected nodes');
  }
};

const getApproximateHistoricalNetworkTPCCapability = async () =>  {
  try {
    console.log('getApproximateHistoricalNetworkTPCCapability')
    if( await isConnected()){
      return await helios.hls.getApproximateHistoricalNetworkTPCCapability() || helios.eth.getApproximateHistoricalNetworkTPCCapability();
    } 
  } catch (error) {
    console.log(error);
    throw new Error('Failed to get Approximate Historical Network TPCCapability');
  }
};

const getApproximateHistoricalTPC = async () =>  {
  try {
    console.log('getApproximateHistoricalTPC')
    if( await isConnected()){
      return await helios.hls.getApproximateHistoricalTPC() || helios.eth.getApproximateHistoricalTPC();
    } 
  } catch (error) {
    console.log(error);
    throw new Error('Failed to get Approximate Historical  TPC');
  }
};

const getFaucet = async (tx) =>  {
  try {
    console.log('getFaucet')
    if( await isConnected()){
    //  const address=selectedAddress();
     // if(address!=null){
      return await helios.hls.getFaucet(tx)|| helios.eth.getFaucet(tx);
    
    } 
  } catch (error) {
    console.log(error);
    throw new Error('Failed to get faucet');
  }
};

const getBlockByHash = async (tx) => {
  try {
    if (await this.isConnected()) {
      return await helios.hls.getBlockByHash(tx)|| helios.eth.getBlockByHash(tx);
    }
  } catch (error) {
    console.log(error);
    throw new Error('Failed to get block by hash');
  }
};

const getTransactionReceipt = async (tx) => {
  try {
    if (await this.isConnected()) {
      return await helios.hls.getTransactionReceipt(tx) || helios.eth.getTransactionReceipt(tx);
    }
  } catch (error) {
    console.log(error);
    throw new Error('Failed to get transaction receipt');
  }
};


const getTransactionByHash = async (tx) => {
  try {
    if (await this.isConnected()) {
      return await helios.hls.getTransactionByHash(tx) || helios.eth.getTransactionByHash(tx);
    }
  } catch (error) {
    console.log(error);
    throw new Error('Failed to get transaction by hash');
  }
};

const getReceivableTransactions = async (tx) => {
  try {
    if (await this.isConnected()) {
      return await helios.hls.getReceivableTransactions(tx) || helios.eth.getReceivableTransactions(tx);
    }
  } catch (error) {
    console.log(error);
    throw new Error('Failed to get receivable transactions');
  }
};


const sendRawBlock = async (tx) => {
  try {
    if (await this.isConnected()) {
      return await helios.hls.sendRawBlock(tx) || helios.eth.sendRawBlock(tx);
    }
  } catch (error) {
    console.log(error);
    throw new Error('Failed to send  raw block');
  }
};

connectToFirstAvailableNode();
