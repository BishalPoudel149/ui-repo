import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import notificationRoutes from "./src/routes/notificationRoutes.js";
import nodemailer from "nodemailer";

dotenv.config();
const app = express();

app.use(express.json()); // Middleware to parse JSON
app.use("/api/notifications", notificationRoutes);


const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));