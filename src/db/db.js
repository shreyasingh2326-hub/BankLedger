const mongoose = require("mongoose");
const dns = require("dns") //ye krna pdega nhi to error aata h or server connect nhi ho paiga

dns.setServers([
    '1.1.1.1',
    '8.8.8.8'
]);

async function connectDB(){
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected successfully")
    }
    catch(error){
        console.log(error)
        console.log("Databse is not connected")
        process.exit(1)
    }
}

module.exports = connectDB