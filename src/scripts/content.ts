/// <reference types="chrome"/>

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
