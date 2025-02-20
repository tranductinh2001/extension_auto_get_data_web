function sendMessage(action, content) {
  chrome.runtime.sendMessage({ action, content });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case "logMS": {
      sendMessage("popupResponLog", message.content);
      break;
    }
  }
});
