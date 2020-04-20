/// <reference types="chrome"/>

console.log('background');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'openInit') {
        chrome.windows.create({
            url: 'index.html',
            type: 'popup',
            width: 300,
            height: 550,
        });
    }
  });
