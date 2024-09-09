document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("charts");
  const ctx = canvas.getContext("2d");
  canvas.width = 200;
  canvas.height = 200;
  const colors = ["#CCCC00", "#999900"];

  chrome.storage.local.get({ permamentStorage: {} }, function (result) {
    const permamentStorage = result.permamentStorage || {};
    const llmConsumption = permamentStorage.consumptionOfLLMs || 0;
    const webConsumption = permamentStorage.consumptionOfWebpages || 1;
    const totalConsumption = llmConsumption + webConsumption;
    const drawPieChart = (ctx, data) => {
      const startAngle = 0;
      let currentAngle = startAngle;
      data.forEach((value, index) => {
        const sliceAngle = (value / totalConsumption) * 2 * Math.PI;
        const endAngle = currentAngle + sliceAngle;

        ctx.beginPath();
        ctx.arc(
          canvas.width / 2,
          canvas.height / 2,
          canvas.width / 2.1,
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
        canvas.width / 4.4,
        0,
        2 * Math.PI
      );
      ctx.fillStyle = "#FFFFFF";
      ctx.fill();
    };

    const drawOutline = (ctx, size) => {
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, size, 0, 2 * Math.PI);
      ctx.fillStyle = "#000000";
      ctx.fill();
    };

    const drawRandomNumber = (ctx) => {
      ctx.font = "14px Arial";
      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        (Math.round(totalConsumption) / 1000).toString() + " Kg CO2",
        canvas.width / 2,
        canvas.height / 2
      );
    };

    const drawTable = (permamentStorage) => {
      const tableContainer = document.getElementById("tableExtension");

      // Create the table and table body
      const table = document.createElement("table");
      table.margin = "0 auto";
      table.borderCollapse = "collapse";
      const tableBody = document.createElement("tbody");
      // Helper function to create a row
      const createRow = (label, value, color) => {
        const row = document.createElement("tr");
        row.textAlign = "center";
        row.backgroundColor = color;
        const labelCell = document.createElement("td");
        labelCell.style.border = "1px solid black";
        labelCell.style.padding = "8px";
        labelCell.style.textAlign = "center";
        const valueCell = document.createElement("td");
        valueCell.style.border = "1px solid black";
        valueCell.style.padding = "8px";
        valueCell.style.textAlign = "center";

        labelCell.textContent = label;
        valueCell.textContent = value;
        row.appendChild(labelCell);
        row.appendChild(valueCell);
        return row;
      };
      tableBody.appendChild(
        createRow(
          "Consumption of requests",
          (
            Math.round(permamentStorage.consumptionOfWebpages) / 1000
          ).toString() + " Kg of CO2",
          colors[1]
        )
      );
      tableBody.appendChild(
        createRow(
          "Consumption of LLMs",
          (Math.round(permamentStorage.consumptionOfLLMs) / 1000).toString() +
            " Kg of CO2",
          colors[0]
        )
      );
      tableBody.appendChild(
        createRow(
          "Requests made",
          Math.round(permamentStorage.httpRequestsMade).toString(),
          "white"
        )
      );
      tableBody.appendChild(
        createRow(
          "Requests to LLMs",
          Math.round(permamentStorage.requestsToLLMs).toString(),
          "white"
        )
      );
      tableBody.appendChild(
        createRow(
          "Trees smoked",
          (Math.round(totalConsumption) / 25000).toFixed(3).toString() +
            " tree years",
          "white"
        )
      );
      table.appendChild(tableBody);
      tableContainer.appendChild(table);
    };

    drawOutline(ctx, canvas.width / 2);
    drawPieChart(ctx, [llmConsumption, webConsumption]);
    drawOutline(ctx, canvas.width / 4);
    drawWhiteCircle(ctx);
    drawRandomNumber(ctx);
    drawTable(permamentStorage);
  });
});
