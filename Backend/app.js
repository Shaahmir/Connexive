import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createServer } from 'node:http';
import cors from 'cors';
import userRoutes from './src/Routes/userRoutes.js';
import { connnectToSocket } from './src/Controllers/socketController.js';

import dns from "node:dns/promises";
dns.setServers(["1.1.1.1", "8.8.8.8"]);

dotenv.config({ quiet: true });

const app = express();
const server = createServer(app);
const io = connnectToSocket(server);

app.set("port", process.env.PORT || 8080);

app.use(cors());
app.use(express.json({ limit: '40kb' }));
app.use(express.urlencoded({ limit: '40kb', extended : true}));

app.use("/api/v1/user", userRoutes);

(async () => {

    const dbConnection = await mongoose.connect(process.env.MONGODB_URL);
    console.log(`MONGO DB is connected to host ${dbConnection.connection.host}`)

    server.listen(app.get("port"), () => {
        console.log(`App is working on port ${app.get("port")}`);
    });
})();