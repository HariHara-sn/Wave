# LearnPro AI - Backend

## 📌 Overview
The backend of **LearnPro AI** is built using **Node.js (Express.js)** and **MongoDB**, providing a scalable, secure, and efficient API for the e-learning platform. It handles user authentication, AI-powered recommendations, course management, payments, and real-time interactions.

## 🛠 Tech Stack
| Component       | Technology |
|----------------|-----------|
| **Backend**   | Node.js (Express.js) |
| **Database**  | MongoDB |
| **Authentication** | JWT, OAuth 2.0 |
| **Payments** | Razorpay |
| **AI/ML** | NLP-based AI mentor |

## 📂 Project Structure
```
backend/
│── src/
│   ├── controllers/        # Business logic for routes
│   ├── routes/             # Express routes
│   ├── middlewares/        # Authentication & validation
│   ├── utils/              # Utility functions
│   ├── config/             # Environment & configuration files
│── .env                    # Environment variables
│── package.json            # Dependencies & scripts
│── server.js               # Entry point
```

## 🚀 Installation & Setup
### **1. Clone the Repository**
```sh
git clone https://github.com/ZDart2025/LearnProAI.git
cd LearnProAI/backend
```

### **2. Install Dependencies**
```sh
npm install
```

### **3. Set Up Environment Variables**
Create a `.env` file and add the required credentials:
```ini
HTTP_PORT= 5000
WS_PORT = 7003
WS_PORT_CLIENT = 7004
MONGO_URI=mongodb+srv://your-mongo-url
JWT_SECRET=your-secret-key
RAZORPAY_KEY_ID=your-key-id
RAZORPAY_KEY_SECRET=your-key-secret
```

### **4. Start the Server**
```sh
npm start
```

## 🔒 Security & Compliance
- **Authentication:** JWT-based user authentication
- **Data Protection:** Encryption for sensitive user data
- **Rate Limiting:** Protection against API abuse

## 📜 License
**MIT License** - Open source & free to use!

## 🤝 Contributing
We welcome contributions! Feel free to submit issues and pull requests.

## 📧 Contact
For inquiries, reach out at **contact@learnproai.com**

---
🚀 **Learn smarter with LearnPro AI!**

