document.addEventListener("DOMContentLoaded", function () {
  const requestList = document.getElementById("request-list");
  // chrome.storage.local.get(
  //   { permamentStorage: { requests: [] } },
  //   function (result) {
  //     requestList.innerHTML = "";

  //     const requests = result.permamentStorage.requests || [];
  //     requests.forEach((request) => {
  //       const listItem = document.createElement("li");
  //       listItem.textContent = `${request.method}: ${request.url}`;
  //       requestList.appendChild(listItem);
  //     });
  //   }
  // );
  chrome.storage.local.get({ permamentStorage: {} }, function (result) {
    requestList.innerHTML = "";
    const permamentStorage = result.permamentStorage || {};
    for (const key in permamentStorage) {
      if (key === "requests") continue;
      const value = permamentStorage[key];
      const listItem = document.createElement("li");
      listItem.textContent = `${key}: ${value}`;
      requestList.appendChild(listItem);
    }
  });
});
