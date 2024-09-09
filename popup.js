document.addEventListener("DOMContentLoaded", function () {
  const requestList = document.getElementById("request-list");
  chrome.storage.local.get({ permamentStorage: {} }, function (result) {
    //requestList.innerHTML = "";
    const permamentStorage = result.permamentStorage || {};
    for (const key in permamentStorage) {
      if (key === "requests") continue;
      const value = permamentStorage[key];
      const listItem = document.createElement("li");
      listItem.textContent = `${key}: ${value}`;
      requestList.appendChild(listItem);
    }
  });

  const clearButton = document.getElementById("clearButton");
  clearButton.addEventListener("click", function () {
    chrome.storage.local.clear(function () {
      chrome.storage.local.get({ permamentStorage: {} }, function (result) {
        const permamentStorage = result.permamentStorage || {};
        permamentStorage.httpRequestsMade = 0;
        permamentStorage.requestsToWebpages = 0;
        permamentStorage.requestsToLLMs = 0;
        permamentStorage.consumptionOfWebpages = 0;
        permamentStorage.consumptionOfLLMs = 0;
        permamentStorage.previousWebsite = "";
        chrome.storage.local.set({ permamentStorage: permamentStorage });
        const requestList = document.getElementById("request-list");
        requestList.innerHTML = "";
        for (const key in permamentStorage) {
          if (key === "requests") continue;
          const value = permamentStorage[key];
          const listItem = document.createElement("li");
          listItem.textContent = `${key}: ${value}`;
          requestList.appendChild(listItem);
        }
      });
    });
  });
});
