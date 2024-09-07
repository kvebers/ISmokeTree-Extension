chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    const requestData = {
      url: details.url,
      method: details.method,
      requestBody: details.requestBody ? details.requestBody.raw : null,
    };

    chrome.storage.local.get({ requests: [] }, function (result) {
      let requests = result.requests || [];
      requests.push(requestData);
      chrome.storage.local.set({ requests: requests });
    });
  },
  { urls: ["https://*/*", "http://*/*"] },
  ["requestBody"]
);
