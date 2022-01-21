chrome.runtime.onInstalled.addListener(function (details) {
    //if this is the first time this extension is installed/updated/chrome updated
    //we need to set the local storage of query time to a time where the first run
    //of the extension forces a search of the data
    let tempTime = new Date('2004-01-01');
    console.log(tempTime);
    chrome.storage.local.set({ "lastTimeRefreshed": tempTime.valueOf() });
})