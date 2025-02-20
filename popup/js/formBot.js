document.getElementById("startScraping").addEventListener("click", async () => {
  let selector1 = document.getElementById("selector1").value;
  let selector2 = document.getElementById("selector2").value;
  let nextSelector = document.getElementById("nextSelector").value;

  if (!selector1 || !selector2 || !nextSelector) {
    alert("Vui lòng nhập đủ thông tin!");
    return;
  }

  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab) {
    alert("Không tìm thấy tab nào đang mở!");
    return;
  }

  chrome.runtime.sendMessage({
    action: "actionTask",
    selector1: selector1,
    selector2: selector2,
    nextSelector: nextSelector,
  });

  // chrome.scripting
  //   .executeScript({
  //     target: { tabId: tab.id },
  //     func: scrapeData,
  //     args: [selector1, selector2, nextSelector],
  //   })
  //   .then((results) => {
  //     console.log("🟢 Kết quả trả về từ content script:", results);
  //   });
});
