const express = require("express");
const app = express();
const path = require("path");
const port = 3000;
const http = require("http");
const socketio = require("socket.io");
const mongoose = require("mongoose");
const Session = require("./models/Session");

const server = http.createServer(app);
const io = socketio(server, {
  cors: { origin: "*" }
});

// Color hex → human name map (must match your swatches in index.ejs)
const colorNames = {
  "#e74c3c": "Red",
  "#3498db": "Blue",
  "#2ecc71": "Green",
  "#f39c12": "Orange",
  "#9b59b6": "Purple",
  "#1abc9c": "Teal",
  "#e67e22": "Dark Orange",
  "#e91e8c": "Pink",
};

// Connect to local MongoDB
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

// Track active sessions by socket ID
const activeSessions = {};

io.on("connection", function (socket) {

  socket.on("send-location", async function (data) {
    const { latitude, longitude, name, color } = data;

    // Broadcast to all clients as before
    io.emit("receive-location", { id: socket.id, latitude, longitude, name, color });

    // If this socket doesn't have a session yet, create one
    if (!activeSessions[socket.id]) {
      const session = await Session.create({
        name,
        colorHex: color,
        colorName: colorNames[color] || color,
        joinedAt: new Date(),
        lastSeen: { lat: latitude, lng: longitude },
      });
      activeSessions[socket.id] = session._id;
    } else {
      // Session exists — just update last known location
      await Session.findByIdAndUpdate(activeSessions[socket.id], {
        lastSeen: { lat: latitude, lng: longitude },
      });
    }
  });

  socket.on("disconnect", async function () {
    io.emit("user-disconnected", socket.id);

    // Close out the session with leftAt timestamp
    if (activeSessions[socket.id]) {
      await Session.findByIdAndUpdate(activeSessions[socket.id], {
        leftAt: new Date(),
      });
      delete activeSessions[socket.id];
    }
  });
});

app.get("/", (req, res) => {
  res.render("index");
});

server.listen(port, () => {
  console.log(`localhost listening at http://localhost:${port}`);
});