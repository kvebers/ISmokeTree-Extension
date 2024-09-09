document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("charts");
  const ctx = canvas.getContext("2d");
  canvas.width = 200;
  canvas.height = 200;

  chrome.storage.local.get({ permamentStorage: {} }, function (result) {
    const permamentStorage = result.permamentStorage || {};
    const llmConsumption = permamentStorage.consumptionOfLLMs || 0;
    const webConsumption = permamentStorage.consumptionOfWebpages || 1;
    const totalConsumption = llmConsumption + webConsumption;
    const drawPieChart = (ctx, data) => {
      const colors = ["#CCCC00", "#999900"];
      const startAngle = 0;
      let currentAngle = startAngle;
      data.forEach((value, index) => {
        const sliceAngle = (value / totalConsumption) * 2 * Math.PI;
        const endAngle = currentAngle + sliceAngle;

        ctx.beginPath();
        ctx.arc(
          canvas.width / 2,
          canvas.height / 2,
          canvas.width / 2,
          currentAngle,
          endAngle
        );
        ctx.lineTo(canvas.width / 2, canvas.height / 2);
        ctx.fillStyle = colors[index];
        ctx.fill();

        currentAngle = endAngle;
      });
    };

    const drawWhiteCircle = (ctx) => {
      ctx.beginPath();
      ctx.arc(
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 4,
        0,
        2 * Math.PI
      );
      ctx.fillStyle = "#FFFFFF";
      ctx.fill();
    };

    const drawTable = (permamentStorage) => {
      const tableContainer = document.getElementById("table");

      // Create the table and table body
      const table = document.createElement("table");
      const tableBody = document.createElement("tbody");
      // Helper function to create a row
      const createRow = (label, value) => {
        const row = document.createElement("tr");
        const labelCell = document.createElement("td");
        const valueCell = document.createElement("td");
        labelCell.textContent = label;
        valueCell.textContent = value;
        row.appendChild(labelCell);
        row.appendChild(valueCell);
        return row;
      };
      tableBody.appendChild(
        createRow(
          "Requests made",
          Math.round(permamentStorage.httpRequestsMade).toString()
        )
      );
      tableBody.appendChild(
        createRow(
          "Requests to LLMs",
          Math.round(permamentStorage.requestsToLLMs).toString()
        )
      );
      tableBody.appendChild(
        createRow(
          "Consumption of requests",
          (
            Math.round(permamentStorage.consumptionOfWebpages) / 1000
          ).toString() + " Kg of CO2"
        )
      );
      tableBody.appendChild(
        createRow(
          "Consumption of LLMs",
          (Math.round(permamentStorage.consumptionOfLLMs) / 1000).toString() +
            " Kg of CO2"
        )
      );
      tableBody.appendChild(
        createRow(
          "Trees smoked",
          (Math.round(totalConsumption) / 25000).toFixed(3).toString() +
            " tree years"
        )
      );
      table.appendChild(tableBody);
      tableContainer.appendChild(table);
    };

    drawPieChart(ctx, [llmConsumption, webConsumption]);
    drawWhiteCircle(ctx);
    drawTable(permamentStorage);
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
      });
    });
  });
});
