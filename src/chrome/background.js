
function checkForValidUrl(tabId, changeInfo, tab) {
    console.log('something');
    if(typeof tab != "undefined" && typeof tab != "null" ) {
        // If the tabs URL contains "specificsite.com"...
        //This would work in the same way as *specificsite.com*, with 0 or more characters surrounding the URL.
        if (/tudiabetes[.]org/.test(tab.url)) {
            // ... show the page action.
            chrome.pageAction.show(tabId);
        }
    }
};

// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForValidUrl);
