const express = require("express");
const morgan=require("morgan");
require("express-async-errors");
const cors=require("cors"); //cross origin resource sharing error cause two ports running one domain to another domain 3000to8000
require("dotenv").config();
require("./db");
const userRouter = require("./routes/user");
const actorRouter = require("./routes/actor");
const movieRouter=require("./routes/movie");
const { handleNotFound } = require("./utils/helper");


const app = express();
app.use(cors());   //cross origin error solve
app.use(express.json());
app.use(morgan("dev")); //toget detail path i think in terminal
app.use("/api/user", userRouter);
app.use("/api/actor", actorRouter);
app.use("/api/movie", movieRouter);

app.use('/*',handleNotFound);

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
