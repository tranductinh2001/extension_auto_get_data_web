// document.getElementById("startScraping").addEventListener("click", async () => {
//   let selector1 = document.getElementById("selector1").value;
//   let selector2 = document.getElementById("selector2").value;
//   let nextSelector = document.getElementById("nextSelector").value;

//   if (!selector1 || !selector2 || !nextSelector) {
//     alert("Vui lòng nhập đủ thông tin!");
//     return;
//   }

//   let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

//   chrome.scripting.executeScript({
//     target: { tabId: tab.id },
//     function: scrapeData,
//     args: [selector1, selector2, nextSelector],
//   });
// });

// function scrapeData(selector1, selector2, nextSelector) {
//   let results = [];

//   async function scrapePage() {
//     let elements1 = document.querySelectorAll(selector1);
//     let elements2 = document.querySelectorAll(selector2);
//     let nextButton = document.querySelector(nextSelector);

//     elements1.forEach((el, index) => {
//       let text1 = el.textContent.trim();
//       let text2 = elements2[index]?.textContent.trim() || "";
//       results.push(`${text1} - ${text2}`);
//     });

//     console.log("Đã lấy dữ liệu:", results);

//     if (nextButton) {
//       nextButton.click();
//       await new Promise((r) => setTimeout(r, 2000));
//       scrapePage();
//     } else {
//       let blob = new Blob([results.join("\n")], { type: "text/plain" });
//       let link = document.createElement("a");
//       link.href = URL.createObjectURL(blob);
//       link.download = "scraped_data.txt";
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     }
//   }

//   scrapePage();
// }
