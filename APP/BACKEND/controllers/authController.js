//Core logic of our backend

const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/generateToken");
const { connectToMongoDB } = require("../config/db");

async function initializeDriveDocument(userId, db) {
  const drive = db.collection("Drive");
  const driveDoc = { [userId]: [] };

  await drive.insertOne(driveDoc);
}
///------------------------------------Register ------------------------------------------
exports.register = async (req, res) => {
  const { db, client } = await connectToMongoDB();
  const { userId, username, password } = req.body;
  console.log(req.body);

  if (!userId || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  try {
    const users = db.collection("Users");

    const existingUser = await users.findOne({ userId: userId});

    console.log(existingUser);

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userDoc = {
      userId: userId,
      username: username,
      password: hashedPassword,
    };
    await users.insertOne(userDoc);
    await initializeDriveDocument(userId, db);

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    await client.close();
  }
};

//------------------------------------Login ------------------------------------------

exports.login = async (req, res) => {
  const { db, client } = await connectToMongoDB();
  const { userId, password } = req.query;

  if (!userId || !password) {
    return res.status(400).json({ message: "Missing userId or password" });
  }

  try {
    const users = db.collection("Users");


    const userDoc = await users.findOne({ userId: userId });

    if (!userDoc) {
      return res.status(401).json({ message: "User not found" });
    }

    const hashedPassword = userDoc.password;

    const isMatch = await bcrypt.compare(password, hashedPassword);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const jwtToken = generateToken(userId);

    return res.status(200).json({ message: "Login successful", token: jwtToken,user:{userId:userDoc.userId,username:userDoc.username} });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  } finally {
    await client.close();
  }
};
