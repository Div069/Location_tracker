const socket = io(); // connection request goes to backend from here

if (navigator.geolocation) {
  //to check if browser supports geolocation
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      socket.emit("send-location", { latitude, longitude });
    },
    (error) => {
      console.log(error);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 3000,
    }
  );
}

const map = L.map("map").setView([0, 0], 18); //leaflet map is created here

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: " Divyansh-Gupta ",
}).addTo(map); //leaflet map is added here

const markers = {};

socket.on("receive-location", (data) => {
  const { id, latitude, longitude } = data;
  map.setView([latitude, longitude]);
  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]);
  } else {
    markers[id] = L.marker([latitude, longitude]).addTo(map);
  }
});

socket.on("user-disconnected", (id) => {
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});
