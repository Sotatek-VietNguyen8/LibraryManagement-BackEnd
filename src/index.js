import express from "express";
import dotenv from "dotenv";
import authRoute from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors"; 
const app = express()
app.use(cookieParser())
app.use(express.json())

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use("/api/auth", authRoute)

dotenv.config()
const port = process.env.PORT 
const host = process.env.host

app.listen(port, host, () =>{
    console.log(`Server is running on http://${host}:${port}`)
    connectDB()
})