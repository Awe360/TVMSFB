import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import {connectDB} from './db/ConnectDB.js';
import { app, server } from './socket/index.js';
import mediaRoutes from './routes/MediaRoutes.js';
import TVRoutes from './routes/TVRoutes.js';
import AdminRoutes from './routes/AdminRoutes.js';
import ScheduleRoutes from './routes/ScheduleRoutes.js'
dotenv.config();
// Middleware
app.use(cors({
    origin: ["http://localhost:3000", "https://tvms-mint.vercel.app"],
    credentials: true,
}));
app.use(express.json());

// Use mediaRoutes as a middleware
app.use('/api/media', mediaRoutes);
app.use('/api/tv',TVRoutes)
app.use('/api/admin',AdminRoutes);
app.use('/api/schedule',ScheduleRoutes);


// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    connectDB();
    console.log(`Server running on port ${PORT}`);
});







