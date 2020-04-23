/// <reference types="chrome"/>

/**
 * injectScript - Inject internal script to available access to the `window`
 *
 * @param  {type} file_path Local path of the internal script.
 * @param  {type} tag The tag as string, where the script will be append (default: 'body').
 * @see    {@link http://stackoverflow.com/questions/20499994/access-window-variable-from-content-script}
 */
console.log('inject');
function injectScript(file_path, tag) {
    const node = document.head || document.documentElement
    const script = document.createElement('script')
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', file_path);
    node.appendChild(script);
}
injectScript(chrome.extension.getURL('web3.js'), 'body');



console.log('content');

window.onload = function() {
  const button = document.createElement('button');
  button.textContent = 'Helios Enable';
  button.setAttribute('id', 'heliosMetask');
  document.body.insertAdjacentElement('afterbegin', button);
  button.addEventListener('click', () => {
    chrome.runtime.sendMessage('', {
      type: 'openInit'
    });
  });
};


chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  console.log(request.type);
  if (request.type === 'access') {
    console.log(window.helios);
    // web3.hls.defaultAccount = request.address ;
  }
});