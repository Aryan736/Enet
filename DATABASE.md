# Database Overview

This project uses MongoDB with Mongoose for all persistent data.

## Connection Setup

- Database connection file: [config/db.js](config/db.js)
- The app connects with `mongoose.connect(process.env.MONGO_URI)`.
- If the connection fails, the process exits with code `1`.
- The server boots from [server.js](server.js), which loads environment variables through `dotenv` and calls `connectDB()` during startup.

### Required Environment Variables

- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: used for authentication tokens in the auth layer
- `PORT`: optional, defaults to `5550`

## Collections / Models

### User

Model file: [models/user.js](models/user.js)

Fields:

- `name`: required string
- `email`: required unique string, stored lowercase
- `password`: required string, minimum 6 characters
- `bio`: optional string, defaults to empty
- `skills`: string array, defaults to empty array
- `location`: optional string, defaults to empty
- `website`: optional string, defaults to empty
- `role`: enum of `entrepreneur`, `investor`, or `mentor`, defaults to `entrepreneur`
- `profilePicture`: optional string, defaults to empty

Notes:

- Timestamps are enabled.
- Passwords are hashed before save in the auth controller.

### Post

Model file: [models/post.js](models/post.js)

Fields:

- `user`: required ObjectId reference to `User`
- `title`: required string
- `content`: required string
- `category`: enum of `idea`, `funding`, `collaboration`, `news`, or `other`, defaults to `idea`
- `likes`: array of `User` ObjectId references
- `tags`: string array, defaults to empty array
- `image`: optional string, defaults to empty

Notes:

- Timestamps are enabled.
- Posts are populated with basic user fields in feed and detail queries.

### Connection

Model file: [models/connection.js](models/connection.js)

Fields:

- `sender`: required ObjectId reference to `User`
- `receiver`: required ObjectId reference to `User`
- `status`: enum of `pending`, `accepted`, or `rejected`, defaults to `pending`

Notes:

- Timestamps are enabled.
- Connection requests are one-directional until accepted.

## Data Relationships

- A `User` can create many `Post` documents.
- A `User` can like many posts, and each post can have many likes.
- A `Connection` links two users through sender and receiver references.
- Accepted connections are treated as mutual network relationships in the API response.

## Database Usage By Route

### Auth Routes

File: [routes/authRoutes.js](routes/authRoutes.js)

- `POST /api/auth/register`: create a new user
- `POST /api/auth/login`: authenticate a user
- `GET /api/auth/profile`: fetch the current user profile
- `PUT /api/auth/profile`: update the current user profile
- `GET /api/auth/users`: list other users

Controller: [controllers/authController.js](controllers/authController.js)

### Post Routes

File: [routes/postRoutes.js](routes/postRoutes.js)

- `POST /api/posts`: create a post
- `GET /api/posts`: get all posts
- `GET /api/posts/myposts`: get the logged-in user's posts
- `GET /api/posts/:id`: get one post
- `PUT /api/posts/:id`: update a post
- `DELETE /api/posts/:id`: delete a post
- `PUT /api/posts/:id/like`: like or unlike a post

Controller: [controllers/postController.js](controllers/postController.js)

### Connection Routes

File: [routes/connectionRoutes.js](routes/connectionRoutes.js)

- `POST /api/connections/send/:id`: send a connection request
- `PUT /api/connections/accept/:id`: accept a request
- `PUT /api/connections/reject/:id`: reject a request
- `GET /api/connections`: list accepted connections
- `GET /api/connections/pending`: list received pending requests
- `GET /api/connections/sent`: list sent pending requests
- `DELETE /api/connections/:id`: remove a connection or request

Controller: [controllers/connectionController.js](controllers/connectionController.js)

## Behavior Notes

- All post and connection routes are protected by JWT middleware.
- Register and login return a token for client-side session handling.
- The application serves static frontend files from the `frontend/` directory.
- The root route redirects to the registration page.

## Quick Summary

- Database: MongoDB
- ODM: Mongoose
- Main collections: `User`, `Post`, `Connection`
- Connection source: [config/db.js](config/db.js)