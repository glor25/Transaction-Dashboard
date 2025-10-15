Transaction Dashboard

Feature : 
Grid View : Displays transaction data grouped by Year and Month.

Create: add new transaction data 
Read: view complete details of each transaction.
Update: edit existing transaction data.
Delete: delete transaction data with confirmation.
Interface: Clean, responsive, and attractive UI built with React and Tailwind CSS.
Simple Backend: Easy to run mock API server using json-server.

Technology Used : 
This project is divided into two main parts:
1. Backend (Folder: /backend)
Node.js: JavaScript execution environment.
json-server: To quickly create a fake REST API from a db.json file.
2. Frontend (Folder: /frontend)
React.js: JavaScript library for building user interfaces.
Tailwind CSS: CSS framework for fast and modern design.
JavaScript : Main programming language.

🚀 How to Run Project
Make sure you have the following software installed:
- Node.js 
- npm
Installation & Running
This process requires two terminals running simultaneously.

1. Menjalankan Backend (API Server)
Open the first terminal :
1. Go to the backend directory -> cd backend
2. Install all required packages (only once) -> npm install
3. Run the API server -> npm start

API server will now be running at http://localhost:3001. Keep this terminal open.

2. Running the Frontend (React Application)
Open second terminal:
1. Go to frontend directory -> cd frontend
2. Install all required packages (only once) -> npm install
3. Run the React application -> npm start

The application will automatically open in browser at http://localhost:3000.

📁 Folder Structure

Transaction-Dashboard/
├── backend/              
│   ├── db.json          
│   └── package.json
│
├── frontend/            
│   ├── public/
│   ├── src/
│   │   └── App.jsx       
│   └── package.json
│
└── README.md           

📝 Additional Notes
Make sure the backend (API server) is running before running the frontend.

All data you add, edit, or delete will be automatically saved in the backend/db.json file.
