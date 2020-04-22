/// <reference types="chrome"/>
import Web3 from 'helios-web3';

var web3: any;
console.log('content');

const button = document.createElement('button');
button.textContent = 'Helios Enable';
button.setAttribute('id', 'heliosMetask');
document.body.insertAdjacentElement('afterbegin', button);
button.addEventListener('click', () => {
  chrome.runtime.sendMessage('', {
    type: 'openInit'
  });
});

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  console.log(request.type);
  if (request.type === 'access') {
    const availableNodes = request.availableNodes;
    await connectToFirstAvailableNode(availableNodes);
    console.log(web3);
    //web3.hls.defaultAccount = request.address ;
}
});

async function connectToFirstAvailableNode(availableNodes: string) {
  console.log(`connectToFirstAvailableNode`);
  try {
    if (web3 && !(web3.currentProvider == null || !web3.currentProvider.connected)) {
      return true;
    } else {
      for (const node of availableNodes) {
          console.log(`Connecting to node ${node}`);
          web3 = new Web3(new Web3.providers.WebsocketProvider(node));
          // web3.extend(this.methods);
          // console.log(web3);
          try {
            const listen = await web3.eth.net.isListening();
            // await web3.eth.net.getPeerCount();
            if (isConnected(availableNodes) || listen) {
                console.log(`Successfully connected to ${node}`);
                return web3;
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

async function isConnected(availableNodes: string) {
  try {
    if (web3 && !(web3.currentProvider == null || !web3.currentProvider.connected)) {
      return true;
    } else {
      const connect = await connectToFirstAvailableNode(availableNodes);
      return connect;
    }
  } catch (error) {
    throw error;
  }
}