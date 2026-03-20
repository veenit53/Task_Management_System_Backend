cd "h:\Task-Management System\Backend"; $content = @'
# Task Management System - Backend

This is the Node.js + Express backend API for the Task Management System.

## Features
- User sign up / login with JWT authentication
- Create, read, update, delete tasks
- MongoDB database connection with Mongoose
- CORS enabled for front-end apps

## Project Structure

- `index.js` - app entry point, middleware setup, route mounting
- `databaseConfig/connectDatabase.js` - MongoDB connection logic
- `controllers/common/auth.controller.js` - authentication controller logic
- `controllers/user/task.controller.js` - task controllers
- `routes/auth.routes.js` - user authentication routes
- `routes/user/task.routes.js` - task endpoints
- `models/user.model.js` - User schema
- `models/task.model.js` - Task schema
- `middlewares/auth.middleware.js` - JWT auth middleware
- `utility/asyncHandler.js` - async error handler wrapper

## Requirements
- Node.js 18+ (recommended)
- MongoDB connection URI

## Setup

1. Clone repository
   \`\`\`bash
   git clone <repo-url>
   cd "Task-Management System/Backend"
   \`\`\`
2. Install dependencies
   \`\`\`bash
   npm install
   \`\`\`
3. Create `.env` file with:
   \`\`\`env
   PORT=8080
   MONGO_URI=<your-mongodb-uri>
   JWT_SECRET=<your-secret>
   \`\`\`
4. Start server
   \`\`\`bash
   node index.js
   \`\`\`

## API Endpoints

### Auth
- `POST /users/register` - Register a new user (name, email, password)
- `POST /users/login` - Login and get JWT (email, password)

### Tasks (authenticated)
- `GET /tasks` - Get user tasks
- `GET /tasks/:id` - Get single task by ID
- `POST /tasks` - Create a task
- `PUT /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task

> Note: The backend uses cookies or Authorization header for token in `auth.middleware.js`.

## Run in development
\`\`\`bash
npm install -g nodemon
nodemon index.js
\`\`\`

### POST /users/login

Request:
{
  "email": "veenit14@gmail.com",
  "password": "12345678"
}

Response:
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "...",
    "email": "veenit14@gmail.com"
  }
}

## Notes
- Ensure your front-end origin is added to CORS in `index.js`.
- For production, secure your JWT secret and use HTTPS.
'@; Set-Content -Path .\readme.md -Value $content -Encoding UTF8