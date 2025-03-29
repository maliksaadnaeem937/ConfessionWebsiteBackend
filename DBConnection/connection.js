const mongoose=require('mongoose');

const connectDB = async () => {
  try {
    const options = {
      dbName: process.env.DbName,
    };

    await mongoose.connect(process.env.MONGO_URI, options);
  } catch (e) {
    console.log(e);
  }
};
connectDB();
module.exports=connectDB;