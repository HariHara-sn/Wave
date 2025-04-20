const express = require("express");
const teacherDriveRoutes =  require("./routes/teacherDriveRoutes");
const authroutes = require("./routes/authroutes");


require("dotenv").config();

const app = express();
const cors = require("cors");
app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());
app.use("/teacher/upload", teacherDriveRoutes);
app.use("/user",authroutes)

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
