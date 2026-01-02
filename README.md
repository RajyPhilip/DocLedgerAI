# 📄 DocLedger - Document Processing System

DocLedger is a comprehensive document processing system that handles PDF uploads, text extraction, translation, summarization, and data extraction using AI.

## ✨ Features
- 📤 Upload and store PDF documents
- 🔤 Extract text from PDFs automatically
- 🌍 Translate documents to multiple languages
- 📝 Generate AI-powered summaries
- 🏷️ Extract structured data using AI
- 🔄 Real-time processing status updates
- 💡 Fallback to sample data when AI services fail
- 📊 User-friendly document management dashboard

## 🏗️ Tech Stack
- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **File Storage**: Cloudinary
- **AI Services**: Google Gemini API

## 🚀 Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- PostgreSQL (version 12 or higher)
- npm or yarn package manager
- Cloudinary account (for file storage)
- Google Gemini API key

### Step 1: Clone the Repository
Clone the project repository to your local machine.

### Step 2: Backend Setup
Navigate to the backend directory and install dependencies:
1.) `npm i`
2.) Create `.env` file with required environment variables
3.) `npm run dev`

### Step 3: Frontend Setup
Navigate to the frontend directory and install dependencies:
1.) `npm i`
2.) `npm start`

## 📋 Environment Variables

### Backend (.env file)
Create a `.env` file in the backend directory with:
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/docledger_dev
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
GEMINI_API_KEY=your_gemini_api_key

## 🔄 How It Works
1. **Upload PDF**: Users upload PDF files through the web interface
2. **Text Extraction**: System extracts raw text from the PDF once and stores it
3. **Parallel Processing**: Three operations run independently:
   - **Translation**: Converts text to target language and generates new PDF
   - **Summarization**: Uses AI to create concise document summary
   - **Data Extraction**: Extracts structured information using AI
4. **Real-time Updates**: UI shows live status of each processing task
5. **Fallback Support**: If AI services fail, system uses pre-defined sample data

## ✅ Ready to Use
Once both servers are running, open your browser and navigate to:
http://localhost:3000
