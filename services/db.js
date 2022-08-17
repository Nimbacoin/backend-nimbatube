// import mongoose for use
// const mongoose = require('mongoose')
import mongoose from "mongoose";
/* we create a function that will establish a connection with our 
MongoDB Cluster
*/
const connnection = {};
const conectUrl =
  "mongodb+srv://uradmine:guYGHY4GWEN53MbT@cluster0.z1np8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const connectDB = async () => {
  console.log("MonogoDb is connected");
  if (connnection.isConnected) {
    return;
  }

  const db = await mongoose.connect(conectUrl, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  //

  connnection.isConnected = db.connections[0].readyState;
};

export default connectDB;
//module.exports=connectDB