// import {connectToMongoDB}  from "../config/db";
// import { requestHeader } from "../utils/generateToken"


// // api => "/teacher/socialmedia/createPost" method = post
// exports.createPost = async (req,res)=>{

//     //  header la irunthu token vanganum 
//     const header = req.headers['authorization'];
//     const postToken = requestHeader(header);
    
//     // body la irunthu content, postUrl vanganum 
//     const {postContent,postUrl} = req.body;

//     //connect to mongodb 
//     const {db, client } = await connectToMongoDB();
//     const collection = db.collection('Posts');

//     // insert  the below detatils into the Posts collection 
//     const now = new Date();

//     const input = {
//         postContent : postContent,
//         postUrl : postUrl,
//         likes : [],
//         comments : [],
//         createdAt : now
//     }



// }

// //api => "/teacher/socialmedia/viewPost" method = get
// exports.viewPost = (req,res)=>{

// }

// //api => "/teacher/socialmedia/deletePost" method = post
// exports.deletePost = (req,res)=>{

// }

// //api => "/teacher/socialmedia/editPost" method = post
// exports.editPost = (req,res) =>{

// }