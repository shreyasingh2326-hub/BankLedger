const express = require("express");

const authRouter = require("./routes/auth.routes")
const cookieparser = require("cookie-parser")



const app = express();

app.use(express.json())
app.use(cookieparser())

app.use("/api/auth",authRouter)


module.exports = app;

// app.js k 2 kaam hai server create and server config krna sewrver config mei aata hai kon sa middleware use 
// krna hai or kon sa api create krna h