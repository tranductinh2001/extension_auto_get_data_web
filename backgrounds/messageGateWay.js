function sendMessage(action, content) {
  chrome.runtime.sendMessage({ action, content });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case "logMS": {
      sendMessage("popupResponLog", message.content);
      break;
    }
    case "continueScrapingMS": {
      const { tabId, selector1, selector2, nextSelector } = message;
      chrome.runtime.sendMessage(
        {
          action: "continueScraping",
          tabId,
          selector1,
          selector2,
          nextSelector,
        },
        (response) => {
          sendResponse(response);
        }
      );
      break;
    }
  }
});
