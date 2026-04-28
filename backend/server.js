import express from "express"
import cors from 'cors'
import 'dotenv/config'
import connectDB from "./config/mongodb.js"
import connectCloudinary from "./config/cloudinary.js"
import userRouter from "./routes/userRoute.js"
import doctorRouter from "./routes/doctorRoute.js"
import adminRouter from "./routes/adminRoute.js"
import medicalRouter from './routes/medicalRoutes.js'
import contactRouter from './routes/contactRoute.js'

// app config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// Configure CORS middleware
const allowedOrigins = [
  'http://localhost:5173',   // frontend dev
  'http://localhost:5174',   // admin dev
  process.env.FRONTEND_URL, // production frontend (set in Vercel env vars)
  process.env.ADMIN_URL,    // production admin (set in Vercel env vars)
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, Postman, curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: ${origin}`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'token', 'atoken', 'dtoken']
}))

// middlewares
app.use(express.json())

// api endpoints
app.use("/api/user", userRouter)
app.use("/api/admin", adminRouter)
app.use("/api/doctor", doctorRouter)
app.use('/api/medical', medicalRouter)
app.use('/api', contactRouter)

app.get("/", (req, res) => {
  res.send("API Working")
});

// Use app.listen only in local development
// Vercel uses the exported app as a serverless function
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => console.log(`Server started on PORT:${port}`))
}

export default app;
