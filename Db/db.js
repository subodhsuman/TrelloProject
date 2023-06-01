const mongoose = require('mongoose');
 let url="mongodb://localhost:27017/Trello"
  const connectDB =async () => {
    try {
      await mongoose.connect(url, {useNewUrlParser: true});
      console.log("MongoDB Connected")
    } catch (error) {
      console.log(error);
    }
  };
  module.exports = connectDB;