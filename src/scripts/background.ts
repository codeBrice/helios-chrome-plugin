/// <reference types="chrome"/>

console.log('background');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('background', request.type);
    if (request.type === 'openInit') {
        chrome.windows.create({
            url: `index.html#/confirm-access?id=${sender.tab.id}`,
            type: 'popup',
            width: 300,
            height: 550,
        });
    }
    if (request.type === 'access') {
        console.log('background confirm-access');
    }
  });