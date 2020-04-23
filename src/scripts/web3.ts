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

async function connectToFirstAvailableNode() {
  console.log(`connectToFirstAvailableNode`);
  try {
    if (helios && !(helios.currentProvider == null || !helios.currentProvider.connected)) {
      return true;
    } else {
      for (const node of availableNodes) {
          console.log(`Connecting to node ${node}`);
          helios = new Web3(new Web3.providers.WebsocketProvider(node));
          // helios.extend(this.methods);
          // console.log(helios);
          try {
            const listen = await helios.eth.net.isListening();
            // await helios.eth.net.getPeerCount();
            if (isConnected() || listen) {
                console.log(`Successfully connected to ${node}`);
                window.helios = helios;
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
