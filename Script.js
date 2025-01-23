// MQTT connection details
const broker = "broker.hivemq.com"; // Public MQTT broker
const port = 8000;                 // WebSocket port
const topic = "sensor/health";     // MQTT topic

// Chart.js setup
const ctx = document.getElementById("healthChart").getContext("2d");
const healthChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Heart Rate (bpm)",
        borderColor: "red",
        data: [],
        fill: false,
      },
      {
        label: "SpO2 (%)",
        borderColor: "blue",
        data: [],
        fill: false,
      },
      {
        label: "Temperature (°C)",
        borderColor: "green",
        data: [],
        fill: false,
      },
    ],
  },
  options: {
    responsive: true,
    scales: {
      x: { title: { display: true, text: "Time" } },
      y: { title: { display: true, text: "Values" }, beginAtZero: true },
    },
  },
});

// Connect to MQTT broker
const client = mqtt.connect(`wss://${broker}:${port}/mqtt`);

client.on("connect", () => {
  document.getElementById("status").innerText = "Connected to MQTT Broker";
  client.subscribe(topic, (err) => {
    if (err) {
      console.error("Subscription error:", err);
    }
  });
});

client.on("message", (topic, message) => {
  const data = JSON.parse(message.toString());
  const time = new Date().toLocaleTimeString();

  // Update sensor values on the webpage
  document.getElementById("heartRate").innerText = data.heartRate;
  document.getElementById("spo2").innerText = data.spo2;
  document.getElementById("temperature").innerText = data.temperature;

  // Add data to the chart
  healthChart.data.labels.push(time);
  healthChart.data.datasets[0].data.push(data.heartRate); // Heart Rate
  healthChart.data.datasets[1].data.push(data.spo2);      // SpO2
  healthChart.data.datasets[2].data.push(data.temperature); // Temperature

  // Keep the chart limited to 10 data points
  if (healthChart.data.labels.length > 10) {
    healthChart.data.labels.shift();
    healthChart.data.datasets[0].data.shift();
    healthChart.data.datasets[1].data.shift();
    healthChart.data.datasets[2].data.shift();
  }

  healthChart.update();
});

client.on("error", (error) => {
  console.error("MQTT error:", error);
  document.getElementById("status").innerText = "Failed to connect to MQTT Broker.";
});
