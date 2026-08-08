# Real-Time Location Tracker

A full-stack web app where multiple people can see each other's live location on a shared map in real time.

## Live Demo

https://realtime-tracker-production-8f3e.up.railway.app

Open the link on any device, enter your name, pick a color, and hit Join. Share the same link with someone else and watch each other's markers move in real time.

## What it does

- Each user enters a name and picks a color before joining
- Your GPS location is tracked continuously and broadcast to everyone on the map
- Every user appears as a named, color-coded marker that moves as they move
- The map stays static under your control, only the markers update
- When someone leaves, their marker is removed automatically
- Session data (name, color, join time, disconnect time, last known location) is stored in MongoDB

## Tech Stack

- **Backend** — Node.js, Express, Socket.IO
- **Frontend** — HTML, CSS, Vanilla JavaScript, EJS
- **Database** — MongoDB, Mongoose
- **Map** — Leaflet.js, OpenStreetMap
- **Hosting** — Railway

## Run locally

Clone the repo:

git clone https://github.com/aryansalunke/Realtime-tracker.git
cd Realtime-tracker

Install dependencies:

npm install

Add a .env file in the root:

MONGO_PUBLIC_URL=your_mongodb_connection_string

Start the server:

node app.js

Open http://localhost:3000 in your browser.
