

---

# SocialConnector Clone Backend

This is the backend codebase for an Instagram Clone project, developed using Node.js, Express, and MongoDB. It provides a RESTful API for managing user authentication, posts, messaging, and other core functionalities of a social media application.

## Features

1. **User Authentication**
   - User registration with password encryption (using bcrypt).
   - Login functionality with JSON Web Token (JWT) for authentication.
   - Optional avatar upload during registration.

2. **User Profile Management**
   - Update bio, username, and email.
   - Change password.
   - Upload/update profile and cover photos.

3. **Post Management**
   - Users can create posts with image uploads (compulsory) and captions/descriptions.
   - Delete posts (allowed only for the post creator).
   - Like/unlike posts by other users.

4. **Follow/Unfollow Functionality**
   - Follow/unfollow other users.
   - Display follower and following counts.
   - Notifications for new followers.

5. **Messaging System**
   - Real-time text messaging.
   - Image sharing in chats.

6. **Search Functionality**
   - Search for users by name or username.
   - View user profiles from search results.

7. **Notification System**
   - Centralized in-app notifications for:
     - New followers.
     - Likes and comments on posts.
     - Messages received.

8. **Error Handling**
   - Centralized error handling using custom middleware.

9. **Environment Configurations**
   - Secure environment variables managed using `dotenv`.

10. **Code Quality**
    - Prettier is used for code formatting.

11. **Utilities**
    - File uploads handled via Multer and processed using Sharp.
    - Cloudinary integration for storing images.

---

## Project Structure

```
src/
├── controllers/
│   ├── healthCheck.controller.js
│   ├── message.controller.js
│   ├── post.controller.js
│   └── user.controller.js
├── db/
│   └── index.js
├── middlewares/
│   ├── auth.middleware.js
│   ├── error.middlewares.js
│   └── multer.middleware.js
├── models/
│   ├── comment.model.js
│   ├── conversation.model.js
│   ├── message.model.js
│   ├── post.models.js
│   └── user.models.js
├── routes/
│   ├── healthCheck.routes.js
│   ├── message.routes.js
│   ├── post.routes.js
│   └── user.routes.js
├── utils/
│   ├── ApiError.js
│   ├── ApiResponse.js
│   └── asyncHandler.js
├── app.js
└── index.js
```

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/abhimanyujangid/Instagram-CLONE.git
   cd Instagram-CLONE/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `backend/` directory with the following variables:
   ```env
   PORT=5000
   MONGO_URI=<your_mongodb_connection_string>
   JWT_SECRET=<your_jwt_secret>
   CLOUDINARY_NAME=<cloudinary_cloud_name>
   CLOUDINARY_API_KEY=<cloudinary_api_key>
   CLOUDINARY_API_SECRET=<cloudinary_api_secret>
   ```

4. Start the server:
   - Development:
     ```bash
     npm run dev
     ```
   - Production:
     ```bash
     npm start
     ```

---

## API Endpoints

### Health Check
- **GET** `/api/health`
  - Checks the health of the backend.

### User Routes
- **POST** `/api/users/register`
- **POST** `/api/users/login`
- **PUT** `/api/users/update`
- **GET** `/api/users/:id`

### Post Routes
- **POST** `/api/posts/create`
- **DELETE** `/api/posts/:id`
- **GET** `/api/posts/:id`

### Message Routes
- **POST** `/api/messages/send`
- **GET** `/api/messages/:conversationId`

---

## Scripts

- `npm start`: Starts the server in production mode.
- `npm run dev`: Starts the server in development mode using `nodemon`.
- `npm run prettier`: Formats the code using Prettier.

---

## Dependencies

- **bcrypt**: Password hashing.
- **cloudinary**: Cloud-based image storage.
- **cookie-parser**: Parse cookies for authentication.
- **cors**: Cross-Origin Resource Sharing.
- **dotenv**: Load environment variables.
- **express**: Web framework for building APIs.
- **jsonwebtoken**: JWT-based authentication.
- **mongoose**: MongoDB ORM.
- **multer**: File uploads.
- **sharp**: Image processing.
- **winston**: Logging.

---

## Dev Dependencies

- **nodemon**: Hot reloading during development.
- **prettier**: Code formatting.

---

## Author

Developed by **Abhimanyu**.  
[GitHub Repository](https://github.com/abhimanyujangid/Instagram-CLONE)

---

## Contributing

Feel free to open issues or pull requests for improvements or bug fixes.

---
