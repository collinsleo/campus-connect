const mongoose = require('mongoose');

const connectDb = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URL)

        console.log('Database connected successfully');
    }catch(error){
        console.log('Error connecting to mongoDb', error.message);
    }
}

module.exports = connectDb;