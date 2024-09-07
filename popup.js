document.addEventListener("DOMContentLoaded", function () {
  const requestList = document.getElementById("request-list");
  chrome.storage.local.get({ requests: [] }, function (result) {
    let requests = result.requests;
    requestList.innerHTML = "";
    requests.forEach(function (request) {
      let listItem = document.createElement("li");
      listItem.textContent = `${request.method}: ${request.url}`;
      requestList.appendChild(listItem);
    });
  });
});
