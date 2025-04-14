const express = require("express");
const voiceAlertRoutes =  require("./routes/voiceAlertRoutes");

require("dotenv").config();

const app = express()


app.use(express.json());
app.use("/teacher/upload",voiceAlertRoutes);

const port = process.env.PORT;

app.listen(port,()=>{
    console.log(`Server is running at ${port}`);
})
