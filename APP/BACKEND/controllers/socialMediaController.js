const {connectToMongoDB}  = require("../config/db");
const  { requestHeader , insertDataToMongodb} = require("../utils/generateToken");

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
exports.viewPost = (req,res)=>{

}

//api => "/teacher/socialmedia/deletePost" method = post
exports.deletePost = (req,res)=>{

}

//api => "/teacher/socialmedia/editPost" method = post
exports.editPost = (req,res) =>{

}