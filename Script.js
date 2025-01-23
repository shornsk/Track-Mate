client.on("message", (topic, message) => {
  const data = JSON.parse(message.toString());
  const time = new Date().toLocaleTimeString();

  // Update sensor values on the webpage
  document.getElementById("heartRate").innerText = data.heartRate;
  document.getElementById("spo2").innerText = data.spo2;
  document.getElementById("temperature").innerText = data.temperature;

  // Add data to the chart
  healthChart.data.labels.push(time);
  healthChart.data.datasets[0].data.push(data.heartRate);
  healthChart.data.datasets[1].data.push(data.spo2);

  // Add temperature to chart (optional: create a separate dataset for it)
  // If you want temperature in a separate graph, create a second chart

  // Keep the chart limited to 10 data points
  if (healthChart.data.labels.length > 10) {
    healthChart.data.labels.shift();
    healthChart.data.datasets[0].data.shift();
    healthChart.data.datasets[1].data.shift();
  }

  healthChart.update();
});
