const express = require("express");
const app = express()
const cors = require("cors");
const env =  require("dotenv"); env.config();

const authRoutes = require("./routes/auth.route")
const userRoute = require("./routes/user.route")
const announcementsRoute = require("./routes/accouncement.route")
const complaintRoute = require("./routes/complaint.route")
const dashboardRoute = require("./routes/dashboard.route")
const connectDb = require("./config/database.config");

app.use(cors())
app.use(express.json())


connectDb();

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoute)
app.use("/api/announcements", announcementsRoute)
app.use("/api/complaints", complaintRoute)
app.use("/api/dashboard", dashboardRoute)


const PORT = process.env.PORT || 7000;
app.listen(PORT, ()=>{
    console.log(`App running on port http://localhost:${PORT}`);
  
})