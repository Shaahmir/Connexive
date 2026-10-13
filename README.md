# Connexive

**Real-time conversations, built around WebRTC.**

Connexive is a MERN stack video-conferencing app built for quick, room-based conversations. It brings live audio and video, screen sharing, in-meeting chat, and meeting history into one React experience, with Socket.IO coordinating the real-time connections between participants. The interface has its own visual identity, including a rotating 3D Enderman rendered with Three.js. Connexive is a hands-on exploration of real-time web communication, peer connections, and building a complete application across the frontend and backend.

## What it can do

### Room-based video meetings
Create a meeting room from the landing page or join an existing room using its meeting link or code. Each room has its own route, so participants can connect to the same session.

### Live audio and video
Connexive uses the browser's media APIs to access the camera and microphone. Participants can preview their setup before joining, toggle their microphone or camera during a call, and view other participants' video streams.

### Screen sharing
Share your screen from inside a meeting when you need to walk through code, a presentation, or anything else on your desktop. Screen sharing depends on browser support and permission from the user.

### In-meeting chat
Send text messages without leaving the call. Messages are exchanged in real time and associated with the meeting room, making it easier to share quick notes or links while talking.

### Meeting history
Registered users can view saved meeting entries, including the meeting code and date. Connexive stores this history in MongoDB so it is available beyond the current page session.

### Account registration and login
Create an account with a name, username, and password, then log in to access account-related features. Passwords are hashed on the server with `bcrypt` before being stored.

### A 3D Enderman model
The home experience features a 3D Enderman model loaded from `enderman.glb`. It is rendered with React Three Fiber and Drei, with a continuous rotation to give the interface a little character.

### A designed, animated interface
The app includes a dedicated landing page, authentication screens, a meeting lobby, the live meeting view, and a meeting-history page. Scroll-based card animations, custom SVG assets, and a purple-led visual direction help give each part of the experience a consistent feel.

## Tech stack

| Area | Technologies |
| --- | --- |
| Frontend | React, Vite, React Router, Axios, Material UI |
| 3D | Three.js, GLB model assets |
| Real-time communication | Socket.IO, WebRTC, browser MediaDevices APIs |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| Authentication | `bcrypt`, token-based session handling |
| Utilities | UUID, dotenv, CORS |

## How it works

The React frontend handles the pages, meeting controls, local media preview, participant streams, and chat interface. WebRTC carries the audio and video between browsers, while Socket.IO exchanges the signaling information needed to establish peer connections and broadcasts room events and chat messages. Express exposes the account and meeting-history endpoints, and Mongoose stores user and meeting records in MongoDB.

## Getting started

### Requirements

- Node.js and npm
- A MongoDB instance, either local or hosted through MongoDB Atlas
- A modern browser with camera and microphone support

### 1. Clone the repository

```bash
git clone https://github.com/Shaahmir/Connexive.git
cd Connexive
```

### 2. Install backend dependencies

```bash
cd Backend
npm install
```

### 3. Configure the backend

Create a `.env` file in the `Backend` directory:

```env
MONGODB_URL=mongodb://127.0.0.1:27017/connexive
PORT=8080
```

Start MongoDB first if you're using a local database. If you're using MongoDB Atlas, replace the example `MONGODB_URL` with your connection string.

### 4. Start the backend

From the `Backend` directory, run:

```bash
npm start
```

The API and Socket.IO server will start on `http://localhost:8080` by default.

For auto-restarts while developing, the repository defines an `npm run dev` script that uses Nodemon. Nodemon is not currently listed in the backend dependencies, so install it before using that script:

```bash
npm install --save-dev nodemon
npm run dev
```

### 5. Install frontend dependencies

Open a second terminal from the repository root and run:

```bash
cd Frontend
npm install
```

### 6. Start the frontend

```bash
npm run dev
```

Vite will print the local development URL in the terminal, usually `http://localhost:5173`. Open that address in your browser and allow camera or microphone access when prompted.

### Frontend configuration

The meeting page supports a `VITE_BACKEND_URL` variable for its Socket.IO connection. For the local setup, the default is already `http://localhost:8080`. To set it explicitly, create `Frontend/.env` with:

```env
VITE_SERVER_URL=http://localhost:5173
VITE_BACKEND_URL=http://localhost:8080
```

The authentication and meeting-history API base URL is currently set directly in `Frontend/src/contexts/AuthContext.jsx` to `http://localhost:8080/api/v1/user`. If you run the backend on a different host or port, update that URL too.

## Project structure

```text
Connexive/
├── Backend/
│   ├── src/
│   │   ├── Controllers/
│   │   │   ├── socketController.js
│   │   │   └── userControllers.js
│   │   ├── Models/
│   │   │   ├── meetingModel.js
│   │   │   └── userModel.js
│   │   └── Routes/
│   │       └── userRoutes.js
│   ├── app.js
│   └── package.json
└── Frontend/
    ├── public/
    │   ├── images/
    │   └── models/
    │       ├── Model.jsx
    │       └── enderman.glb
    ├── src/
    │   ├── assets/
    │   ├── components/
    │   ├── contexts/
    │   ├── controllers/
    │   ├── pages/
    │   ├── styles/
    │   └── utils/
    ├── index.html
    ├── package.json
    └── vite.config.js
```

## Useful commands

Run these from the relevant directory:

| Command | Purpose |
| --- | --- |
| `npm install` | Install dependencies |
| `npm start` (`Backend`) | Start the backend server |
| `npm run dev` (`Backend`, after installing Nodemon) | Start backend with automatic restarts |
| `npm run dev` (`Frontend`) | Start frontend with automatic restarts |

## Notes

- Camera, microphone, and screen-sharing permissions are controlled by the browser. Screen sharing may not be available in every browser or context.
- The default local setup expects the backend on port `8080` and the Vite frontend on its usual development port.
- The current Socket.IO server allows cross-origin connections broadly. Review the CORS and deployment configuration before exposing the application publicly.

## License

Connexive is released under the MIT License. See [LICENSE](./LICENSE) for details.

## Interface

![Connexive interface](./interface.webp)
