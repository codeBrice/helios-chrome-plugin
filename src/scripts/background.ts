/// <reference types="chrome"/>

console.log('background');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('background', request.type);
    if (request.type === 'openInit') {
        chrome.windows.create({
            url: `index.html#/confirm-access?tab=${window.btoa(JSON.stringify(sender.tab))}`,
            type: 'popup',
            width: 300,
            height: 550,
        });
    }
    if (request.type === 'openSend') {
        chrome.windows.create({
            url: `index.html#/send-transaction?tx=${window.btoa(JSON.stringify(request.tx))}
                    &tab=${window.btoa(JSON.stringify(sender.tab))}`,
            type: 'popup',
            width: 300,
            height: 550,
        });
    }
  });