document.getElementById("startScraping").addEventListener("click", async () => {
  let selector1 = document.getElementById("selector1").value;
  let selector2 = document.getElementById("selector2").value;
  let nextSelector = document.getElementById("nextSelector").value;

  if (!selector1 || !selector2 || !nextSelector) {
    alert("Vui lòng nhập đủ thông tin!");
    return;
  }

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      let activeTab = tabs[0];
      chrome.runtime.sendMessage({
        action: "startScraping",
        tabId: activeTab.id,
        selector1,
        selector2,
        nextSelector,
      });
    }
  });
});
