function sendMessage(action, content) {
  chrome.runtime.sendMessage({ action, content });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("background receve message: ", message.action);
  switch (message.action) {
    case "actionTask": {
      scrapeData(message.selector1, message.selector2, message.nextSelector);
      sendMessage(
        "logMS",
        "param có data sau khi nhận: " +
          message.selector1 +
          " " +
          message.selector2 +
          " " +
          message.nextSelector
      );
      break;
    }
    case "popupResponLog": {
      console.log("background log: ", message.content);
      break;
    }
  }
});

function scrapeData(selector1, selector2, nextSelector) {
  sendMessage(
    "logMS",
    `🟢 param nhận được ${selector1}  ${selector2}  ${nextSelector}`
  );

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (chrome.runtime.lastError) {
      console.error("❌ Lỗi:", chrome.runtime.lastError.message);
      return;
    }
    if (!tabs || tabs.length === 0) {
      console.error("❌ Không tìm thấy tab nào đang mở!");
      return;
    }
    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        func: scrapePage,
        args: [selector1, selector2, nextSelector],
      },
      (results) => {
        console.log(results);
      }
    );
  });
}

async function scrapePage(selector1, selector2, nextSelector) {
  console.log("🟢 Bắt đầu quét dữ liệu...");
  let results = [];

  let elements1 = document.querySelectorAll(selector1);
  let elements2 = document.querySelectorAll(selector2);
  let nextButton = document.querySelector(nextSelector);

  if (elements1.length === 0 || elements2.length === 0) {
    console.warn("⚠️ Không tìm thấy dữ liệu, kiểm tra lại selector!");
    return;
  }

  elements1.forEach((el, index) => {
    let text1 = el.textContent.trim();
    let text2 = elements2[index]?.textContent.trim() || "";
    results.push(`${text1} - ${text2}`);
  });

  console.log("✅ Dữ liệu lấy được:", results);

  if (nextButton) {
    console.log("➡️ Tìm thấy nút tiếp theo, chuyển trang...");
    nextButton.click();
    await new Promise((r) => setTimeout(r, 3000));
    scrapePage(selector1, selector2, nextSelector);
  } else {
    console.log("🛑 Không tìm thấy nút tiếp theo, lưu dữ liệu...");
    saveData(results);
  }
}

function saveData(data) {
  let blob = new Blob([data.join("\n")], { type: "text/plain" });
  let link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "scraped_data.txt";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  console.log("📥 Dữ liệu đã được tải xuống!");
}
