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

document.addEventListener('initHeliosApp', function(data) {
  chrome.runtime.sendMessage('', {
    type: 'openInit'
  });
});

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  console.log(request.type);
  if (request.type === 'access') {
    console.log(window.helios);
    // web3.hls.defaultAccount = request.address ;
  }
});