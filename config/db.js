import mongoose from "mongoose";

let chached = global.mongoose;

if (!chached) {
  chached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (chached.conn) {
    return chached.conn;
  }

  if (!chached.promise) {
    const opts = {
      bufferCommands: false,
    };

    chached.promise = mongoose
      .connect(`${env.process.MONGODB_URI}/quickcart`, opts)
      .then((mongoose) => {
        return mongoose;
      });
  }

  chached.conn = await chached.promise;
  return chached.conn;
};

export default connectDB;
