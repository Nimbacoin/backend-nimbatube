import mongoose from "mongoose";

const connnection = {};
const conectUrl =
  "mongodb+srv://uradmine:guYGHY4GWEN53MbT@cluster0.z1np8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const dbConnect = async () => {
  console.log("MonogoDb is connected");
  if (connnection.isConnected) {
    return;
  }

  const db = await mongoose.connect(process.env.MONGOCONNECT, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  //

  connnection.isConnected = db.connections[0].readyState;
};

export default dbConnect;
