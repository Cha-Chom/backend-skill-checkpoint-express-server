# Q&A Platform Backend API

A RESTful API backend for a Question and Answer platform built with Express.js and PostgreSQL. This API allows users to create, read, update, and delete questions, as well as manage answers for those questions.

## 🚀 Features

- **Question Management**: Create, read, update, and delete questions
- **Answer Management**: Add, view, and delete answers for questions
- **Search Functionality**: Search questions by title and category
- **Data Validation**: Input validation middleware for all endpoints
- **Database Integration**: PostgreSQL database with connection pooling
- **RESTful Design**: Clean and intuitive API endpoints

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [PostgreSQL](https://www.postgresql.org/) (v12 or higher)
- npm or yarn package manager

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend-skill-checkpoint-express-server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Database Setup**
   - Create a PostgreSQL database named `qna-platform`
   - Update the database connection string in `utils/db.mjs` if needed:
     ```javascript
     const connectionPool = new Pool({
       connectionString: "postgresql://postgres:password!@localhost:5432/qna-platform",
     });
     ```

4. **Create Database Tables**
   Run the following SQL commands in your PostgreSQL database:
   ```sql
   -- Create questions table
   CREATE TABLE questions (
     id SERIAL PRIMARY KEY,
     title VARCHAR(255) NOT NULL,
     description TEXT NOT NULL,
     category VARCHAR(100),
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   -- Create answers table
   CREATE TABLE answers (
     id SERIAL PRIMARY KEY,
     question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
     content TEXT NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

## 🚀 Running the Application

1. **Start the development server**
   ```bash
   npm start
   ```

2. **The server will start on port 4000**
   - Server URL: `http://localhost:4000`
   - Test endpoint: `http://localhost:4000/test`

## 📚 API Endpoints

### Questions

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/questions` | Get all questions | - |
| GET | `/questions/:questionId` | Get a specific question | - |
| POST | `/questions` | Create a new question | `{ "title": "string", "description": "string", "category": "string" }` |
| PUT | `/questions/:questionId` | Update a question | `{ "title": "string", "description": "string", "category": "string" }` |
| DELETE | `/questions/:questionId` | Delete a question and its answers | - |

### Search

| Method | Endpoint | Description | Query Parameters |
|--------|----------|-------------|------------------|
| GET | `/questions/search` | Search questions | `?title=string&category=string` |

### Answers

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/questions/:questionId/answers` | Get all answers for a question | - |
| POST | `/questions/:questionId/answers` | Create an answer for a question | `{ "content": "string" }` |
| DELETE | `/questions/:questionId/answers` | Delete all answers for a question | - |

## 📝 API Examples

### Create a Question
```bash
curl -X POST http://localhost:4000/questions \
  -H "Content-Type: application/json" \
  -d '{
    "title": "How to use Express.js?",
    "description": "I am new to Express.js and want to learn the basics.",
    "category": "Programming"
  }'
```

### Get All Questions
```bash
curl http://localhost:4000/questions
```

### Search Questions
```bash
curl "http://localhost:4000/questions/search?title=express&category=programming"
```

### Create an Answer
```bash
curl -X POST http://localhost:4000/questions/1/answers \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Express.js is a minimal web framework for Node.js. Start with the official documentation."
  }'
```

### Get Answers for a Question
```bash
curl http://localhost:4000/questions/1/answers
```

## 🔧 Project Structure

```
backend-skill-checkpoint-express-server/
├── app.mjs                          # Main application entry point
├── package.json                     # Project dependencies and scripts
├── middlewares/
│   └── validation.mjs              # Input validation middleware
├── routes/
│   ├── questions.routes.mjs        # Question CRUD operations
│   ├── questions.search.routes.mjs # Question search functionality
│   └── answer.routes.mjs           # Answer management
└── utils/
    └── db.mjs                      # Database connection configuration
```

## 🛡️ Validation Rules

- **Create Question**: `title` and `description` are required
- **Update Question**: At least one field (`title`, `description`, or `category`) must be provided
- **Search**: At least one search parameter (`title` or `category`) is required
- **Create Answer**: `content` is required and must be 300 characters or less

## 🗄️ Database Schema

### Questions Table
- `id` (SERIAL PRIMARY KEY)
- `title` (VARCHAR(255) NOT NULL)
- `description` (TEXT NOT NULL)
- `category` (VARCHAR(100))
- `created_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)

### Answers Table
- `id` (SERIAL PRIMARY KEY)
- `question_id` (INTEGER REFERENCES questions(id) ON DELETE CASCADE)
- `content` (TEXT NOT NULL)
- `created_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)

## 🚨 Error Handling

The API returns appropriate HTTP status codes and error messages:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error

## 🔄 Development

- The application uses `nodemon` for automatic server restarts during development
- All routes are modularized for better maintainability
- Database transactions are used for operations that affect multiple tables
- Input validation is handled through middleware functions

## 📦 Dependencies

- **express**: Web framework for Node.js
- **pg**: PostgreSQL client for Node.js
- **nodemon**: Development tool for automatic server restarts
