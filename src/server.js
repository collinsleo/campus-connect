const express = require("express");
const app = express()
const cors = require("cors");
const env =  require("dotenv"); env.config();

const authRoutes = require("./routes/auth.route")
const userRoute = require("./routes/user.route")
const connectDb = require("./config/database.config");

app.use(cors())
app.use(express.json())


connectDb();

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoute)


const PORT = process.env.PORT || 7000;
app.listen(PORT, ()=>{
    console.log(`App running on port http://localhost:${PORT}`);
  
})