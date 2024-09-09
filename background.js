chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    const requestData = {
      url: details.url,
      method: details.method,
      requestBody: details.requestBody ? details.requestBody.raw : null,
    };
    if (details.url.includes("localhost")) return;

    let tempStorage = {
      httpRequestsMade: 0,
      requestsToWebpages: 0,
      requestsToLLMs: 0,
      consumptionOfWebpages: 0,
      consumptionOfLLMs: 0,
      previousWebsite: "",
      lastTime: 0,
    };

    chrome.storage.local.get(
      { permamentStorage: tempStorage },
      function (result) {
        const permamentStorage = result.permamentStorage || tempStorage;
        permamentStorage.httpRequestsMade++;
        const currentTime = new Date().getTime();

        if (details.url.includes("https://chatgpt.com/backend-api/memories")) {
          permamentStorage.requestsToLLMs++;
          permamentStorage.consumptionOfLLMs += 4.76 + Math.random() * 2 - 1;
        } else if (
          details.url.includes("https://gemini.google.com/_/BardChatUi")
        ) {
          permamentStorage.requestsToLLMs += 0.25;
          permamentStorage.consumptionOfLLMs +=
            4.76 / 4 + Math.random() * 0.5 - 0.25;
          permamentStorage.lastTime = currentTime;
        } else {
          if (details.method === "GET") {
            permamentStorage.previousWebsite = details.url;
            permamentStorage.requestsToWebpages++;
            permamentStorage.consumptionOfWebpages +=
              1.74 + Math.random() * 0.5;
          }
        }

        tempStorage.httpRequestsMade = permamentStorage.httpRequestsMade;
        tempStorage.requestsToWebpages = permamentStorage.requestsToWebpages;
        tempStorage.requestsToLLMs = permamentStorage.requestsToLLMs;
        tempStorage.consumptionOfWebpages =
          permamentStorage.consumptionOfWebpages;
        tempStorage.consumptionOfLLMs = permamentStorage.consumptionOfLLMs;
        tempStorage.previousWebsite = permamentStorage.previousWebsite;
        tempStorage.lastTime = permamentStorage.lastTime;
        chrome.storage.local.set({ permamentStorage: tempStorage });
      }
    );
  },
  { urls: ["https://*/*", "http://*/*"] },
  ["requestBody"]
);
