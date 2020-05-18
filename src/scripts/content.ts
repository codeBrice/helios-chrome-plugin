/// <reference types="chrome"/>

/**
 * injectScript - Inject internal script to available access to the `window`
 *
 * @param  {type} file_path Local path of the internal script.
 * @param  {type} tag The tag as string, where the script will be append (default: 'body').
 * @see    {@link http://stackoverflow.com/questions/20499994/access-window-variable-from-content-script}
 */
console.log('inject');
function injectScript(filePath) {
    const node = document.head || document.documentElement;
    const script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', filePath);
    node.appendChild(script);
}
injectScript(chrome.extension.getURL('web3.js'));



console.log('content');

document.addEventListener('initHeliosApp', (data) => {
  chrome.runtime.sendMessage('', {
    type: 'openInit'
  });
});

document.addEventListener('sendHelios', (data: CustomEvent) => {
  chrome.runtime.sendMessage('', {
    type: 'openSend',
    tx: data.detail
  });
});

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.type === 'access') {
    const node = document.head || document.documentElement;
    const closeSpan = document.createElement('span');
    closeSpan.setAttribute('id', 'hlsAd');
    closeSpan.textContent = request.address;
    node.appendChild(closeSpan);
  }
  if (request.type === 'statusTransaction') {
    const node = document.head || document.documentElement;
    const closeSpan = document.createElement('span');
    closeSpan.setAttribute('id', 'hlsStatus');
    closeSpan.textContent = request.status;
    node.appendChild(closeSpan);
  }
});
