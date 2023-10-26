const mongoose = require('mongoose')

const mongoURI = 'mongodb+srv://rohit:admin@cluster0.qz5l5.mongodb.net/'        

const connectToMongo = async()=>{
    await mongoose.connect(mongoURI)
    console.log('connected to database')
}


module.exports= connectToMongo;
