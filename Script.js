// MQTT connection configuration
const broker = "broker.hivemq.com";
const port = 8000;
const topic = "sensor/health";

// Connect to the MQTT broker
const client = new Paho.MQTT.Client(broker, port, "TrackMateClient");

// Called when the client connects
client.onConnectionLost = (responseObject) => {
  console.error("Connection lost:", responseObject.errorMessage);
};

client.onMessageArrived = (message) => {
  console.log("Message arrived:", message.payloadString);

  // Parse the JSON payload
  const data = JSON.parse(message.payloadString);
  document.getElementById("heartRate").textContent = `Heart Rate: ${data.heartRate}`;
  document.getElementById("spo2").textContent = `SpO2: ${data.spo2}`;
};

// Connect to the MQTT broker
client.connect({
  onSuccess: () => {
    console.log("Connected to broker");
    client.subscribe(topic); // Subscribe to the topic
  },
  onFailure: (error) => {
    console.error("Connection failed:", error);
  },
});
