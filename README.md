# Backend Blog App with DevOps Concepts

A Node.js + Express backend for a blog application with authentication, user management, post handling, group permissions, and Docker-based deployment setup. The project is built around MongoDB and follows a modular MVC-style structure.

## Features

- User signup, login, and JWT-based authentication
- Password reset flow with email verification
- Logged-in user profile retrieval and updates
- User CRUD operations
- Blog post creation, update, deletion, and retrieval
- Group creation and membership permissions
- Admin role checks for protected actions
- MongoDB integration via Mongoose
- Docker and Docker Compose setup for containerized execution

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Nodemailer
- Docker
- Docker Compose

## Project Structure

```text
BackEnd-Blog-App-with-DevOps-concepts/
├── .github/
├── config/
│   └── config.js
├── controllers/
│   ├── authUser.js
│   ├── groupController.js
│   ├── postController.js
│   └── userController.js
├── middleware/
├── models/
│   ├── db.js
│   ├── groupDb.js
│   └── postDb.js
├── routes/
│   ├── authRouter.js
│   ├── groupRouter.js
│   ├── postRouter.js
│   └── userRouter.js
├── utils/
│   ├── apiError.js
│   ├── sendEmail.js
│   └── validator/
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── main.js
├── package.json
├── package-lock.json
├── server.js
└── README.md
```

## Prerequisites

Before running the project, make sure you have:

- Node.js v22 or newer
- MongoDB running locally or via Docker
- A `.env` file configured

## Environment Variables

Create a `.env` file in the root directory with values similar to:

```env
PORT=4002
DATABASE_URL=mongodb://localhost:27017/blogapp
JWT_SECRET=your_jwt_secret
JWT_DATE=1d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```

For Docker Compose, the app uses the `.env` file as well, and MongoDB is exposed at:

```env
DATABASE_URL=mongodb://mongodb:27017/blogapp
```

## Installation

```bash
npm install
```

## Running the App

### Local Development

```bash
npm run start:dev
```

### Production

```bash
npm run start:prod
```

### Using Docker

```bash
docker compose up --build
```

This starts:

- the backend application
- a MongoDB container

## API Overview

Base path:
```text
/api
```

### Authentication
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/protect`
- `POST /api/auth/forgotPassword`
- `POST /api/auth/verifyCode`
- `PUT /api/auth/resetPass`

### Users
- `GET /api/user`
- `GET /api/user/:id`
- `POST /api/user`
- `PATCH /api/user/:id`
- `DELETE /api/user/:id`
- `PUT /api/user/changePass/:id`
- `GET /api/user/getLoggedUser`
- `PUT /api/user/updateLoggedUser`

### Posts
- `GET /api/post`
- `GET /api/post/:id`
- `GET /api/post/author/:id`
- `POST /api/post/secureAdd`
- `PATCH /api/post/update/:id`
- `DELETE /api/post/delete/:id`
- `DELETE /api/post/deleteAll`

### Groups
- `GET /api/group`
- `POST /api/group`
- `PUT /api/group/addUser`
- `DELETE /api/group/deleteUser`
- `PATCH /api/group/updatePermission`

## Notes

- The app uses role-based authorization for protected routes.
- User password hashing is handled via `bcrypt`.
- Password reset tokens are generated and verified securely using a hashed reset code.
- Docker config exposes the API on port `4001` while the local Node app default is `4002` in `main.js`.

## License

This project is licensed under the ISC License.

## Author

This repository is maintained by IamLegend11.