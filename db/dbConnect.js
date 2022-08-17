import mongoose from "mongoose";

const connnection = {};
const conectUrl =
  "mongodb+srv://ur-admine:vCr9CzHCr0VgV45x@cluster0.luwksuj.mongodb.net/?retryWrites=true&w=majority";

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
