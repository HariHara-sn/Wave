const express = require("express");
const teacherDriveRoutes = require("./routes/teacherDriveRoutes");
const authroutes = require("./routes/authroutes");
const socialMediaRoutes = require("./routes/socialMediaRoutes");

require("dotenv").config();

const app = express();
const cors = require("cors");
app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

// Teacher drive routes 
app.use("/teacher/upload", teacherDriveRoutes);

// Register and login routes 
app.use("/user",authroutes)

// Social Media routes 
app.use("/teacher/socialmedia", socialMediaRoutes)

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
