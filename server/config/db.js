const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI);

const db = mongoose.connection;

db.on("error", (err) => {
  console.log("Error connecting to MongoDB:", err);
});
db.once("open", () => {
  console.log("MongoDB connection established");
});

module.exports=db;