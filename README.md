
# SocialConnector

SocialConnector is a full-stack social media application designed to provide an engaging platform for users to share posts, interact with others, and chat in real time. The project is built using the **MERN stack** (MongoDB, Express, React, Node.js) with a modern and responsive design.

## Features

1. **User Authentication**
   - Secure user registration and login with JSON Web Tokens (JWT).
   - Avatar and cover image upload support.
  
2. **Post Management**
   - Create, view, and like posts with images.
   - Responsive feed for a seamless user experience.

3. **Real-Time Chat**
   - Direct messaging functionality powered by **Socket.IO**.
   - Send text and images in chats.

4. **User Notifications**
   - Notifications for likes, comments, new messages, and followers.

5. **Profile Management**
   - Edit user details like username, bio, password, and profile images.

6. **Search Functionality**
   - Search for other users and view profiles.

---

## Project Structure

The project is organized into two main folders:

### 1. **Backend Folder (`/backend`)**
   - Contains the server-side code for handling APIs, user authentication, posts, messages, and database interactions.
   - Developed with **Node.js**, **Express.js**, and **MongoDB**.
   - Includes Cloudinary integration for image uploads and Multer for file handling.

   #### Key Features:
   - RESTful APIs for all app functionalities.
   - Secure environment configurations using `.env`.
   - Centralized error handling and API response management.

   #### Setup Instructions:
   1. Navigate to the `backend` folder:
      ```bash
      cd backend
      ```
   2. Install dependencies:
      ```bash
      npm install
      ```
   3. Configure `.env` file with the following keys:
      ```env
      PORT=5000
      MONGO_URI=<your_mongodb_connection_string>
      JWT_SECRET=<your_jwt_secret>
      CLOUDINARY_NAME=<cloudinary_cloud_name>
      CLOUDINARY_API_KEY=<cloudinary_api_key>
      CLOUDINARY_API_SECRET=<cloudinary_api_secret>
      ```
   4. Start the server:
      ```bash
      npm run dev
      ```
   5. The backend server will be available at `http://localhost:8001`.

   For more details, refer to the **Backend README** file in the `backend` folder.

---

### 2. **Frontend Folder (`/frontend`)**
   - Contains the client-side code built with **React**, **TypeScript**, and **Vite**.
   - Styled with **ShadCN UI** and integrated with **Redux** for state management.
   - Real-time functionality is powered by **Socket.IO**.

   #### Key Features:
   - Responsive and modern UI with dynamic components.
   - Optimized performance using TypeScript and Vite.
   - Integration with backend APIs for seamless user interactions.

   #### Setup Instructions:
   1. Navigate to the `frontend` folder:
      ```bash
      cd frontend
      ```
   2. Install dependencies:
      ```bash
      npm install
      ```
   3. Start the frontend application:
      ```bash
      npm run dev
      ```
   4. Open your browser and visit `http://localhost:5173`.

   For more details, refer to the **Frontend README** file in the `frontend` folder.

---

## How to Run the Application

1. Clone the repository:
   ```bash
   git clone https://github.com/abhimanyujangid/Instagram-CLONE.git
   ```

2. Start the **backend server**:
   ```bash
   cd backend
   npm run dev
   ```

3. Start the **frontend server**:
   ```bash
   cd frontend
   npm run dev
   ```

4. Access the application:
   - Backend API: `http://localhost:5000`
   - Frontend: `http://localhost:5173`

---

## Technologies Used

- **Frontend**: React, TypeScript, Vite, ShadCN UI, Redux, Socket.IO.
- **Backend**: Node.js, Express.js, MongoDB, Multer, Cloudinary, JWT, bcrypt.
- **Tools**: Prettier, Eslint, Nodemon.

---

