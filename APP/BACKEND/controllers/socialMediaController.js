const {connectToMongoDB}  = require("../config/db");
const  { requestHeader , insertDataToMongodb,decryptToken} = require("../utils/generateToken");

const path = require("path");
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

//save the content to mongodb





// api => "/teacher/socialmedia/createPost" method = post
exports.createPost = async (req,res)=>{
  try{
    //  header la irunthu token vanganum 
    const header = req.headers['authorization'];
    const token = requestHeader(header);
    if(!token){
        res.status(401).json({message: "token was not received to create post api..."});
    }

    
    // body la irunthu content, postUrl vanganum 
    const {postContent} = req.body;
    console.log("postContent",postContent);
    
    // upload the image into imgBB.com

    const filePath = path.join(__dirname, "..", "uploads", req.file.filename);
    const formData = new FormData();
    formData.append("image", fs.createReadStream(filePath));
    formData.append("key", process.env.IMGBB_API_KEY);
    // Upload to ImgBB
    const response = await axios.post(
      "https://api.imgbb.com/1/upload",
      formData,
      {
        headers: formData.getHeaders(),
      }
    );

    const imageUrl = response.data.data.url;
    


    fs.unlinkSync(filePath); 

    // insert  the below detatils into the Posts collection 
    const now = new Date();

    const input = {
        postContent : postContent,
        postUrl : imageUrl,
        likes : [],
        comments : [],
        createdAt : now
    }
    const resp = insertDataToMongodb(input,token);
    if(resp){
    res.status(200).json({message:"Data inserted into the Mongodb Successfully"});
    }
    }
    catch (error){
        res.status(401).json({message:error});
    }


}

//api => "/teacher/socialmedia/viewPost" method = get
exports.viewPost = async (req,res)=>{
  try {

    // Header is "authorization : Bearer 5243453423fds"
    const authHeader = req.headers['authorization'];
    console.log("authheader", authHeader);
    // // Check if token exists in header
    // if (!authHeader || !authHeader.startsWith('Bearer ')) {
    //   return res.status(401).json({ message: 'Missing or invalid token' });
    // }
    // const duu_token = authHeader.split(' ')[1]; // Get the actual token part
    // const dee_token = decryptToken(duu_token);
    const token = requestHeader(authHeader);
    console.log("token",token);
    if (!token) {
      return res.status(400).json({ success: false, message: "Token is missing in request headers." });
    }

    const { db, client } = await connectToMongoDB();
    const collection = db.collection('Posts');
    // const token = "jwt-token-1"; // You may receive this from `req.headers`, `req.cookies`, etc.

    const projection = {};
    projection[token] = 1; // Only include the specific token field in result

    const result = await collection.findOne({}, { projection });

    await client.close();

    if (!result || !result[token]) {
      return res.status(404).json({ success: false, message: "Token data not found in database." });
    }
    console.log(result[token]); 
    return res.status(200).json({
    success: true,
    token: token,
    data: result[token],
    });


    }
    catch(err){
      console.error("Error fetching token data:", err);
      return res.status(500).json({ success: false, message: "Internal server error", error: err.message });

    }

}

//api => "/teacher/socialmedia/deletePost" method = post
exports.deletePost = (req,res)=>{

}

//api => "/teacher/socialmedia/editPost" method = post
exports.editPost = (req,res) =>{

}