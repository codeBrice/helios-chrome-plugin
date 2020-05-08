import Web3 from 'helios-web3';


declare global {
    interface Window { helios: any; }
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
  const event = document.createEvent('Event');
  event.initEvent('initHeliosApp');
  document.dispatchEvent(event);
};

const send = async (tx) => {
  try {
    console.log('sendTransaction');
    if (await isConnected()) {
      const transaction = await helios.hls.sendTransactions([tx]);
      console.log(transaction);
      return transaction;
    }
  } catch (error) {
    console.log(error);
    throw new Error('Failed sendTransaction');
  }
};

const selectedAddress = () => {
  console.log('selectedAddress');
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
                window.helios = { send, enable , selectedAddress};
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

connectToFirstAvailableNode();
