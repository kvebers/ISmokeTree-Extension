// Ensure the chrome.webNavigation API is available

function parseRequests(requests) {
  if (requests.length === 0) {
    return 0;
  }
  if (requests.method === "GET") {
    return 1;
  }
  if (requests.method === "POST") {
    return 1;
  }
  if (requests.method === "PUT") {
    return 1;
  }
  if (requests.method === "DELETE") {
    return 1;
  }
  if (requests.method === "undefined") {
    return 0;
  }
}

chrome.webNavigation.onCompleted.addListener(
  function (details) {
    const requestData = {
      url: details.url,
      method: details.method,
      requestBody: details.requestBody ? details.requestBody.raw : null,
    };
    chrome.storage.local.get({ requests: [] }, function (result) {
      let requests = result.requests;
      if (parseRequests > 0) {
        requests.push(requestData);
        chrome.storage.local.set({ requests: requests });
      }
    });
  },
  { urls: ["https://*/*", "http://*/*"] },
  ["requestBody"]
);
