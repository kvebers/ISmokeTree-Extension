chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    const requestData = {
      url: details.url,
      method: details.method,
      requestBody: details.requestBody ? details.requestBody.raw : null,
    };

    let tempStorage = {
      httpRequestsMade: 0,
      requestsToWebpages: 0,
      requestsToLLMs: 0,
      consumptionOfWebpages: 0,
      consumptionOfLLMs: 0,
      //requests: [],
    };
    chrome.storage.local.get(
      { permamentStorage: tempStorage },
      function (result) {
        const permamentStorage = result.permamentStorage || tempStorage;
        permamentStorage.httpRequestsMade++;
        if (details.url.includes("chatgpt") || details.url.includes("gemini")) {
          permamentStorage.requestsToLLMs++;
          permamentStorage.consumptionOfLLMs +=
            4.76 + Math.random() * 0.5 - 0.25;
        } else {
          if (details.method === "GET") {
            permamentStorage.requestsToWebpages++;
            permamentStorage.consumptionOfWebpages +=
              1.74 + Math.random() * 0.5 - 0.25;
          }
        }
        //permamentStorage.requests.push(requestData);
        chrome.storage.local.set({ permamentStorage: permamentStorage });
      }
    );
  },
  { urls: ["https://*/*", "http://*/*"] },
  ["requestBody"]
);
