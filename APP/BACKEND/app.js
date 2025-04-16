const express = require("express");
const voiceAlertRoutes =  require("./routes/teacherDriveRoutes");

require("dotenv").config();
const cors = require("cors");
const app = express()

app.use(cors({
    origin:"*",

}))


app.use(express.json());
app.use("/teacher/upload",voiceAlertRoutes);

const port = process.env.PORT;

app.listen(port,()=>{
    console.log(`Server is running at ${port}`);
})
