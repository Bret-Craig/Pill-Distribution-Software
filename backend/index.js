const express = require('express');
const cors = require('cors');

const userRoutes = require("./routes/userRoutes");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");

const port = 5000;

const dotenv = require("dotenv");
dotenv.config();

//start connection to database
//-------
const mongoose = require('mongoose');
const mongoDB = process.env.MONGODB_URI;

mongoose.connect(mongoDB).then(() => {
  console.log('DB connected')
}).catch(err => console.log(err));

const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/users", userRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(process.env.PORT || port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});  