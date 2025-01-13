
---

# SocialConnector- Frontend

This is the frontend of an Instagram clone built using the **MERN stack** (MongoDB, Express, React, Node.js). The frontend is developed with **React**, **TypeScript**, **Vite**, **ShadCN UI**, **Redux**, and **Socket.IO**.

## Features

- **User Authentication:** User registration, login, and profile management (avatar, cover image, username, email, password).
- **Post Management:** Create, view, and like posts.
- **Chat Integration:** Real-time chat with direct messaging functionality.
- **Notifications:** User notifications for actions like comments, likes, and new messages.
- **Profile Editing:** Update user information like name, bio, password, and username.
- **Responsive UI:** Adaptable UI for both mobile and desktop devices.

## File Structure

```plaintext
src/
├── assets/                     # Static assets (images, fonts, etc.)
│   ├── images/
│   ├── icons/
│   └── styles/                 # Global stylesheets (if any)
│       └── theme.css
├── components/                 # Reusable UI components
│   ├── Button/
│   │   ├── Button.tsx
│   │   └── Button.module.css
│   ├── Modal/
│   │   ├── Modal.tsx
│   │   └── Modal.module.css
│   ├── Navbar/
│   │   ├── Navbar.tsx
│   │   └── Navbar.module.css
│   ├── Post/
│   │   ├── PostCard.tsx
│   │   └── PostList.tsx
│   ├── Profile/
│   │   ├── Avatar.tsx
│   │   └── ProfileDetails.tsx
│   └── Story/
│       ├── StoryCarousel.tsx
│       └── StoryItem.tsx
├── constants/                  # Application-wide constants
│   └── apiEndpoints.ts
├── features/                   # Redux slices and feature-specific logic
│   ├── auth/                   # Authentication
│   │   ├── authSlice.ts
│   │   ├── AuthService.ts
│   │   └── types.ts
│   ├── posts/                  # Post management
│   │   ├── postsSlice.ts
│   │   ├── PostService.ts
│   │   └── types.ts
│   ├── chat/                   # Chat management
│   │   ├── chatSlice.ts
│   │   ├── ChatService.ts
│   │   └── types.ts
│   ├── notifications/          # Notifications
│   │   ├── notificationsSlice.ts
│   │   ├── NotificationService.ts
│   │   └── types.ts
│   └── theme/                  # Theme management
│       ├── themeSlice.ts
│       └── ThemeService.ts
├── hooks/                      # Custom React hooks
│   ├── useAuth.ts
│   ├── useTheme.ts
│   └── useSocket.ts
├── layouts/                    # Layout components (e.g., dashboard, auth)
│   ├── AuthLayout.tsx
│   └── MainLayout.tsx
├── pages/                      # Application pages
│   ├── Home/
│   │   ├── HomePage.tsx
│   │   ├── PostList.tsx
│   │   └── Home.module.css
│   ├── Profile/
│   │   ├── ProfilePage.tsx
│   │   ├── EditProfile.tsx
│   │   └── Profile.module.css
│   ├── Chat/
│   │   ├── ChatPage.tsx
│   │   ├── ChatList.tsx
│   │   ├── ChatWindow.tsx
│   │   └── Chat.module.css
│   ├── Explore/
│   │   ├── ExplorePage.tsx
│   │   └── Explore.module.css
│   ├── Notifications/
│   │   ├── NotificationsPage.tsx
│   │   └── Notifications.module.css
│   └── Auth/
│       ├── Login.tsx
│       ├── Register.tsx
│       └── Auth.module.css
├── routes/                     # Route definitions and configuration
│   └── AppRoutes.tsx
├── services/                   # API calls and external service integrations
│   ├── apiClient.ts            # Axios instance
│   ├── socketClient.ts         # Socket.IO client instance
│   └── imageService.ts         # Helper functions for image uploads
├── store/                      # Redux store configuration
│   ├── index.ts
│   └── rootReducer.ts
├── types/                      # Shared TypeScript types
│   ├── user.ts
│   ├── post.ts
│   ├── chat.ts
│   └── notification.ts
├── utils/                      # Utility functions
│   ├── formatDate.ts
│   ├── generateUUID.ts
│   ├── validateInput.ts
│   └── debounce.ts
├── App.tsx                     # Main application component
├── main.tsx                    # Vite entry point
└── vite.config.ts              # Vite configuration file
```

## Prerequisites

Before running the application, ensure that you have the following installed:

- **Node.js** (v14.x or higher)
- **npm** (v6.x or higher)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/your-repo/instagram-clone-frontend.git
```

2. Navigate to the project directory:

```bash
cd instagram-clone-frontend
```

3. Install the dependencies:

```bash
npm install
```

## Running the Application

Once the dependencies are installed, you can start the application:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

## Usage

- **Authentication:** Register and log in users with avatar and cover image support.
- **Profile Management:** Edit user profile information (username, bio, password).
- **Post Management:** Create and view posts, and like them.
- **Chat System:** Send and receive messages in real-time.
- **Notifications:** Get notifications for post likes, comments, and messages.

## Contributing

Feel free to fork the repository and create pull requests. Contributions are welcome!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

This README file includes the basic project details, file structure, and setup instructions. Let me know if you need any additional information or customization!
