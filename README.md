# Task Buddy App

Task Buddy is a simple and intuitive task management application built using **React**, **TypeScript**, and **Firebase**. It allows users to create, update, delete, and manage tasks efficiently, offering a seamless experience for task organization and productivity.

## 🚀 Features
- **Task Management**: Create, update, and delete tasks with ease.
- **Real-time Sync**: Uses Firebase Firestore for real-time task updates.
- **Authentication**: Google Sign-In integration for secure access.
- **Local Storage Support**: Stores user preferences and last-viewed tasks.
- **Responsive Design**: Fully optimized for desktop and mobile views.
- **Task Status Tracking**: Mark tasks as completed or pending.
- **Multi-user Support**: Users can manage their tasks independently.

## 🛠 Tech Stack
- **Frontend**: React, TypeScript, CSS
- **Backend**: Firebase Firestore for scalable data storage
- **Authentication**: Firebase Auth with Google Sign-In
- **State Management**: Recoil

## 📌 Prerequisites
Ensure you have the following installed:
- **Node.js** (v16+ recommended)
- **npm** or **yarn**
- **Firebase Account** (for Firestore & Auth setup)
- **Git** (for version control)

## 📥 Installation
```sh
# Clone the repository
git clone https://github.com/yourusername/task-buddy.git
cd task-buddy

# Install dependencies
npm install  # or yarn install
```

## 🔥 Running the Project
1. **Set up Firebase:**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
   - Enable Firestore Database & Authentication (Google Sign-In).
   - Get your Firebase config and add it to `.env`:
   
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

2. **Start the Development Server:**
   ```sh
   npm run dev  # or yarn dev
   ```
   Open [https://taskbuddy-d67d7.web.app](https://taskbuddy-d67d7.web.app) to view the app.

## 🏆 Challenges Faced & Solutions
### 1️⃣ **Chunk Size Warning in Vite**
**Issue:** Some chunks were larger than 500kB.
**Solution:** Implemented dynamic imports to code-split the application, improving performance and load times.

### 2️⃣1️⃣ **Real-time Updates in Firestore**
**Issue:** Tasks were not updating in real-time.
**Solution:** Used Firestore’s `onSnapshot` to listen for changes dynamically and update the UI immediately.

###2️⃣ **Google Sign-In Not Persisting**
**Issue:** Getting Users details from Google Sign-In and rendering is the difficult task
**Solution:** Used local storage to store

## 🛠 Future Enhancements
- **Dark Mode Support** for better user experience.
- **Task Categories & Labels** to organize tasks efficiently.
- **Offline Mode with IndexedDB** to allow access to tasks without an internet connection.
- **Push Notifications** to remind users of pending tasks.
- **Collaboration Features** to allow multiple users to share task lists.

## 👨‍💻 Contributors
- [Sridaran Sivakumar](https://github.com/SridaranSivakumar)
- **Open for Contributions!** Feel free to fork and submit a pull request.



