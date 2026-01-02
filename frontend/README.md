# 📄 DocLedger - Document Processing System

DocLedger is a comprehensive document processing system that handles PDF uploads, text extraction, translation, summarization, and data extraction using AI.

## 🚀 Quick Start

### 1. Fork and Clone
```bash
# Fork the repository on GitHub, then clone:
git clone https://github.com/YOUR_USERNAME/docledger.git
cd docledger
2. Backend Setup
bash
cd backend
npm install
Create .env file:

env
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/docledger_dev
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
GEMINI_API_KEY=your_gemini_api_key
Start backend:

bash
npm run dev
3. Frontend Setup
bash
cd ../frontend
npm install
Start frontend:

bash
npm start
✅ Access Application
Frontend: http://localhost:3000

Backend API: http://localhost:5000

text
i guess the backendsetp nd thee steps should also be in the code same goes for frontend setup do not give diffrent bashes just add it in file
markdown
# 📄 DocLedger - Document Processing System

DocLedger is a comprehensive document processing system that handles PDF uploads, text extraction, translation, summarization, and data extraction using AI.

## 🚀 Quick Start

### 1. Clone and Setup Backend
```bash
git clone https://github.com/YOUR_USERNAME/docledger.git
cd docledger/backend
npm install
Create .env file in /backend directory:

env
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/docledger_dev
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
GEMINI_API_KEY=your_gemini_api_key
Start backend server:

bash
npm run dev
2. Setup Frontend
bash
cd ../frontend
npm install
npm start
✅ Access Application
Frontend: http://localhost:3000

Backend API: http://localhost:5000

📝 Notes
Make sure PostgreSQL is running on your system

Get API keys from Cloudinary and Google Gemini AI
