const mongoose = require('mongoose');

const connectDB = async() => {
    console.log("connecting to db");
    const dbName = 'test';
    await mongoose.connect(
        'mongodb://127.0.0.1:27017', 
    );
    console.log("MongoDB connected");
}
connectDB();