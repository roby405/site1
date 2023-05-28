const mongoose = require("mongoose")

const connToDB = async (res, req) => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch (error) {
        console.log(error)
        process.exit(2)
    }
}

module.exports = connToDB