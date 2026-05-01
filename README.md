# Team Task Manager

A full-stack web application for managing projects and tasks with role-based access control.

## Live Demo

- **Frontend:** https://team-task-manager-frontend-hpir.onrender.com
- **Backend API:** https://team-task-manager-nz8y.onrender.com
- **GitHub:** https://github.com/programerSapna/team-task-manager

## Deployment Note

The assignment mentioned Railway for deployment. However, my Railway free trial expired during development, so I deployed the application on Render.com which provides the same functionality with a live, fully functional URL as required.

## Tech Stack

- **Frontend:** React.js, React Router, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas (Mongoose)
- **Authentication:** JWT (JSON Web Tokens)
- **Deployment:** Render.com

## Features

- User Authentication (Signup/Login with JWT)
- Create and manage Projects
- Add team members with roles (Admin/Member)
- Create, assign, edit and delete Tasks
- Task status tracking (Todo / In Progress / Done)
- Priority levels (Low / Medium / High)
- Due date with overdue detection
- Dashboard with stats (Total Tasks, My Tasks, Completed, Overdue)
- Role-based access control (Admin can manage members and tasks)

## API Endpoints

### Auth

- POST /api/auth/register — Register new user
- POST /api/auth/login — Login user

### Projects

- GET /api/projects — Get all projects
- POST /api/projects — Create project
- GET /api/projects/:id — Get single project
- POST /api/projects/:id/members — Add member (Admin only)
- DELETE /api/projects/:id — Delete project (Admin only)

### Tasks

- GET /api/tasks — Get all tasks
- POST /api/tasks — Create task
- PATCH /api/tasks/:id/status — Update task status
- PUT /api/tasks/:id — Edit task
- DELETE /api/tasks/:id — Delete task

### Dashboard

- GET /api/dashboard — Get dashboard stats and recent tasks

## Project Structure

**Backend:**

- controllers/ — Business logic (auth, projects, tasks, dashboard)
- middleware/ — JWT auth and role-based access checking
- models/ — MongoDB schemas (User, Project, Task)
- routes/ — API route definitions

**Frontend:**

- components/ — Navbar, TaskModal, TaskCard
- context/ — AuthContext for JWT token management
- pages/ — Login, Register, Dashboard, Projects, ProjectDetail
- api/ — Axios configuration with interceptors

## Database Schema

**Users**

- name, email, password (bcrypt hashed), timestamps

**Projects**

- name, description, owner (ref: User), members (array with user ref and role), timestamps

**Tasks**

- title, description, project (ref: Project), assignedTo (ref: User), createdBy (ref: User), status (todo/in_progress/done), priority (low/medium/high), dueDate, timestamps

## Local Setup

### Prerequisites

- Node.js
- MongoDB Atlas account

### Backend Setup


### Backend Setup

cd backend
npm install

Create .env file in backend folder:

PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key

Run backend:
npm run dev

### Frontend Setup

cd frontend
npm install

Create .env file in frontend folder:

REACT_APP_API_URL=http://localhost:5000/api

Run frontend:
npm start

## Screenshots

- Login/Register page
- Dashboard with stats
- Projects list
- Project detail with Kanban board
- Task creation modal

## Developer

- **Name:** Sapna
- **GitHub:** https://github.com/programerSapna
