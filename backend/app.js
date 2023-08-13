const express = require("express");
const morgan=require("morgan");
require("express-async-errors");
require("dotenv").config();
require("./db");
const userRouter = require("./routes/user");


const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use("/api/user", userRouter);

//for express-async errors to avoid try-catch for all code
app.use((err,req,res,next)=>{
  res.status(500).json({error:err.message||err});
});
app.get("/about", (req, res) => {
  res.send("<h1>Hello I am from your backend about finaally i did it again</h1>");
});


app.listen(8000, () => {
  console.log("the port is listening on port 8000");
});
