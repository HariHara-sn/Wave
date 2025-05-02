const {connectToMongoDB}  = require("../config/db");
const  { requestHeader , insertDataToMongodb, generateUnique10DigitId} = require("../utils/generateToken");

const path = require("path");
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

const cloudinary = require("../config/cloudinary");

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

    // const filePath = path.join(__dirname, "..", "uploads", req.file.filename);
    // const formData = new FormData();
    // formData.append("image", fs.createReadStream(filePath));
    // formData.append("key", process.env.IMGBB_API_KEY);
    // // Upload to ImgBB
    // const response = await axios.post(
    //   "https://api.imgbb.com/1/upload",
    //   formData,
    //   {
    //     headers: formData.getHeaders(),
    //   }
    // );

    // const imageUrl = response.data.data.url;
    // const deleteUrl = response.data.data.delete_url;
    

    //upload image to cloudinary 
    const result = await cloudinary.uploader.upload(req.file.buffer, {
      resource_type: 'auto', // auto-detect file type (image or video)
      folder: 'posts', // optional, to organize the uploads
    });

    const imageUrl = result.secure_url;
    const imageId = result.public_id;


    // fs.unlinkSync(filePath); 

    // insert  the below detatils into the Posts collection 
    const now = new Date();
    const postId = generateUnique10DigitId();

    const input = {
        userId : token,
        postId : postId,
        postContent : postContent,
        postUrl : imageUrl,
        imageId : imageId,
        likes : [],
        comments : [],
        createdAt : now
    }
    const resp = insertDataToMongodb(input,"Posts");
    if(resp){
    res.status(200).json({postId : postId, message:"Data inserted into the Mongodb Successfully"});
    }
    }
    catch (error){
      console.log("error",error);
        res.status(401).json({message:error});
    }


}




//api => "/teacher/socialmedia/viewPost" method = get
exports.viewPost = async (req,res)=>{
  try {

    // Header is "authorization : Bearer 5243453423fds"
    const authHeader = req.headers['authorization'];
    console.log("authheader", authHeader);
    const token = requestHeader(authHeader);
    console.log("token",token);
    if (!token) {
      return res.status(400).json({ success: false, message: "Token is missing in request headers." });
    }

    const { db, client } = await connectToMongoDB();
    const collection = db.collection('Posts');
    // const token = "jwt-token-1"; // You may receive this from `req.headers`, `req.cookies`, etc.

    const document = await collection.find({userId :token }).toArray();

      if (!document) {
        return res.status(404).json({ message: 'No data found for the given ID' });
      }
  
      // Return the value (array) of the dynamic field
      res.json({ posts: document });

    await client.close();
    }
    catch(err){
      console.error("Error fetching token data:", err);
      return res.status(500).json({ success: false, message: "Internal server error", error: err.message });

    }

}

async function deleteImageFromImgBB(deleteUrl) {
  try {
    const response = await axios.get(deleteUrl);
    console.log("response from imagbb.com ",response);
    console.log("Image deleted successfully");
    return true;
  } catch (error) {
    console.error("Error deleting image:", error.message);
  }
}

//api => "/teacher/socialmedia/deletePost" method = post
exports.deletePost = async (req,res)=>{

  try {
    
    const authHeader = req.headers["authorization"];
    const token = requestHeader(authHeader);
  
    const { postId } = req.body;

    const {db,client} = await connectToMongoDB();
    const collection = db.collection('Posts');
    const post = await collection.findOne({postId : postId})
    if(!post){
      res.json({message: "post not present"});
    }
    const deleteUrl = post.deleteUrl;
    deleteImageFromImgBB(deleteUrl);

    const result = await collection.deleteOne({ postId: postId });

    if (result.deletedCount === 1) {
      console.log(` Document with postId ${postId} was deleted.`);
    } else {
      console.log(` No document found with postId ${postId}.`);
    }

    await client.close();
    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    await client.close();
  }
  

}

//api => "/teacher/socialmedia/editPost" method = post
exports.editPost = (req,res) =>{

}