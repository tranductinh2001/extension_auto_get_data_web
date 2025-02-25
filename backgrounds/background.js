chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case "popupResponLog": {
      console.log("🟢 log Background: ", message.content);
      break;
    }
    case "startScraping": {
      const { tabId, selector1, selector2, nextSelector } = message;

      console.log("🟢 Nhận yêu cầu scrape từ popup:", message);
      scrapeAndDownload(
        tabId,
        selector1,
        selector2,
        nextSelector,
        sendResponse
      );
      return true;
    }
  }

  function scrapeAndDownload(
    tabId,
    selector1,
    selector2,
    nextSelector,
    sendResponse
  ) {
    chrome.scripting
      .executeScript({
        target: { tabId },
        func: scrapePage,
        args: [selector1, selector2, nextSelector],
      })
      .then((results) => {
        console.log("🟢 Kết quả từ background script:", results);
        downloadNotificationLog(
          results[0]?.result?.title,
          results[0]?.result?.content
        );

        // Kiểm tra xem có nút "Next" không
        if (results[0]?.result?.hasNext) {
          chrome.scripting
            .executeScript({
              target: { tabId },
              func: waitForPageLoad,
              args: [selector2],
            })
            .then(() => {
              // Nếu có, tiếp tục scrape
              setTimeout(() => {
                scrapeAndDownload(
                  tabId,
                  selector1,
                  selector2,
                  nextSelector,
                  sendResponse
                );
              }, 2000);
            });
        } else {
          // Nếu không, gửi phản hồi hoàn tất
          sendResponse({ status: "success", message: "Scraping hoàn tất" });
        }
      })
      .catch((error) => {
        console.error("❌ Lỗi inject script:", error);
        sendResponse({ status: "error", error: error.message });
      });
  }

  function downloadNotificationLog(title, data) {
    const logMessage = `Tiêu đề trang: ${title}\nNội dung trang: \n${data}`;

    // Tạo Blob từ nội dung thông báo
    const blob = new Blob([logMessage], { type: "text/plain" });

    // Sử dụng Tab ID để tạo tên tệp duy nhất cho từng tab
    const fileName = `${title}.txt`;

    // Tạo URL cho Blob
    const reader = new FileReader();
    reader.onload = function () {
      const url = reader.result;

      // Sử dụng chrome.downloads để tải tệp về
      chrome.downloads.download(
        {
          url: url,
          filename: `notifications/${fileName}`, // Lưu vào thư mục "notifications" (bên trong thư mục tải xuống)
          // saveAs: true, // Hiển thị hộp thoại "Save As"
        },
        () => {
          console.log("Đã lưu thông báo cho Tab vào tệp:", fileName);
        }
      );
    };
    reader.readAsDataURL(blob);
  }
});
function waitForPageLoad(selector) {
  return new Promise((resolve) => {
    const targetNode = document.querySelector(selector);
    if (!targetNode) {
      console.warn("⚠️ Không tìm thấy phần tử để theo dõi!");
      resolve();
      return;
    }

    const observer = new MutationObserver((mutationsList, observer) => {
      for (let mutation of mutationsList) {
        if (mutation.type === "childList" || mutation.type === "subtree") {
          console.log("🟢 Phần tử đã được render xong!");
          observer.disconnect();
          resolve();
          return;
        }
      }
    });

    observer.observe(targetNode, {
      childList: true,
      subtree: true,
    });

    // Fallback: Nếu không có thay đổi sau 5 giây, tiếp tục
    setTimeout(() => {
      observer.disconnect();
      resolve();
    }, 5000);
  });
}
function scrapePage(selector1, selector2, nextSelector) {
  function sendMessage(content) {
    chrome.runtime.sendMessage({ action: "logMS", content: content });
  }
  sendMessage(
    `+ parametor được nhận ... tham số 1: ${selector1} tham số 2: ${selector2} tham số 3: ${nextSelector}`
  );

  let results = [];
  let elements1 = document.querySelector(selector1).innerText;
  let elements2 = document.querySelector(selector2);
  let nextButton = document.querySelector(nextSelector);

  let paragraphs = elements2 ? elements2.querySelectorAll("p") : [];
  let content = Array.from(paragraphs)
    .map((p) => p.innerText.trim())
    .join("\n");

  if (elements1.length === 0 || elements2.length === 0) {
    console.warn("⚠️ Không tìm thấy dữ liệu!");
    return;
  }

  sendMessage(`+ Dữ liệu trang hiện tại: ${content}`);
  console.log("+ Dữ liệu trang hiện tại: ", content);

  if (nextButton) {
    console.log("➡️ Chuyển sang trang tiếp theo...");
    nextButton.click();
    return {
      title: elements1,
      content: content,
      hasNext: true,
    };
  } else {
    console.log("🛑 Hoàn tất, gửi dữ liệu về...");
    sendMessage(results);
    return {
      title: elements1,
      content: content,
      hasNext: false,
    };
  }
}
// body > div.content_read > div > div.bookname > h1
// #content
