chrome.runtime.onStartup.addListener(function () {
  chrome.storage.local.clear(function () {});
});

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
      requests: [],
    };

    chrome.storage.local.get(
      { permamentStorage: tempStorage },
      function (result) {
        const permamentStorage = result.permamentStorage || tempStorage;
        permamentStorage.httpRequestsMade++;
        if (details.url.includes("chatgpt") || details.url.includes("gemini")) {
          permamentStorage.requestsToLLMs++;
          permamentStorage.consumptionOfLLMs += 4.76 + Math.random() * 2 - 1;
        } else {
          if (details.method === "GET") {
            permamentStorage.requestsToWebpages++;
            permamentStorage.consumptionOfWebpages +=
              1.74 + Math.random() * 0.5;
          }
        }
        tempStorage = permamentStorage;
        fetch("http://localhost:3001/api/requests", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            httpRequestsMade: permamentStorage.httpRequestsMade,
            requestsToWebpages: permamentStorage.requestsToWebpages,
            requestsToLLMs: permamentStorage.requestsToLLMs,
            consumptionOfWebpages: permamentStorage.consumptionOfWebpages,
            consumptionOfLLMs: permamentStorage.consumptionOfLLMs,
          }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .catch((error) => {});
        permamentStorage.requests.push(requestData);
        chrome.storage.local.set({ permamentStorage: permamentStorage });
      }
    );
  },
  { urls: ["https://*/*", "http://*/*"] },
  ["requestBody"]
);
