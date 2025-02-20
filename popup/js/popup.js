document.getElementById("openPopup").addEventListener("click", function () {
  var popupWindow = window.open(
    chrome.runtime.getURL("../popup/UI/formBot.html"),
    "exampleName",
    "width=400,height=400"
  );
  window.close();
});
