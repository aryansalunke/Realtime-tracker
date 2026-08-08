const socket = io();

const map = L.map("map").setView([0, 0], 16);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "Aryan the Backend King"
}).addTo(map);

const markers = {};
let centeredOnUser = false;
let userName = "";
let userColor = "#e74c3c"; // default color

// --- Color swatch selection ---
document.querySelectorAll(".swatch").forEach(swatch => {
  swatch.addEventListener("click", () => {
    document.querySelectorAll(".swatch").forEach(s => s.classList.remove("selected"));
    swatch.classList.add("selected");
    userColor = swatch.dataset.color;
  });
});

// --- Join button ---
document.getElementById("join-btn").addEventListener("click", () => {
  const input = document.getElementById("name-input").value.trim();
  if (!input) {
    document.getElementById("name-input").focus();
    return;
  }
  userName = input;
  document.getElementById("login-screen").style.display = "none";
  startTracking();
});

// Also allow pressing Enter to join
document.getElementById("name-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter") document.getElementById("join-btn").click();
});

// --- Create a custom colored marker with a name label ---
function createMarkerIcon(name, color) {
  const html = `
    <div class="custom-marker" style="--mc: ${color}">
      <div class="marker-label">${name}</div>
      <div class="marker-pin"></div>
    </div>
  `;
  return L.divIcon({
    html,
    className: "",
    iconAnchor: [0, 40],   // pin tip aligns to coordinates
    popupAnchor: [0, -40],
  });
}

// --- Start tracking after name is entered ---
function startTracking() {
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        socket.emit("send-location", { latitude, longitude, name: userName, color: userColor });

        if (!centeredOnUser) {
          map.setView([latitude, longitude], 16);
          centeredOnUser = true;
        }
      },
      (error) => {
        console.error(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  }
}

// --- Receive other users' locations ---
socket.on("receive-location", (data) => {
  const { id, latitude, longitude, name, color } = data;

  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]);
  } else {
    markers[id] = L.marker([latitude, longitude], {
      icon: createMarkerIcon(name, color)
    }).addTo(map);
  }
});

// --- Remove marker on disconnect ---
socket.on("user-disconnected", (id) => {
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});