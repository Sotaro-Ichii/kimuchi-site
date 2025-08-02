# Musashi

Musashi is a private, invite-only university course review community platform. It helps students share and discover easy and high-quality courses, manage their GPA, and connect with trusted peers. This project is built with React, Vite, Firebase, and Tailwind CSS.

## Features

- **User Authentication**: Google and Email login supported via Firebase Auth.
- **Approval System**: Only approved users can access the main features. Admin approval is required after registration.
- **Course Search & Registration**: Search for courses, view details, and register for courses you are taking.
- **Comment System**: Post and view comments on courses, including ratings and semester information.
- **Responsive Design**: Fully responsive UI for both desktop and mobile users.
- **Semester Recommendations**: View recommended courses by semester.
- **User Badges**: Users can earn badges based on their status or contributions.
- **Contact Form**: Users can send inquiries or feedback (email sending is implemented).
- **Legal & Privacy Pages**: Terms of use, privacy policy, and contact information are provided.
- **One-time Admission Fee**: Only a one-time $50 admission fee is required for membership. No recurring payments.

## Not Yet Complete

- **Stripe Payment Integration**: The Stripe payment flow is not fully implemented yet. (API endpoint exists, but frontend integration is pending.)

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Start the development server**
   ```bash
   npm run dev
   ```
3. **Build for production**
   ```bash
   npm run build
   ```

## Tech Stack
- React 19
- Vite
- Firebase (Auth, Firestore)
- Tailwind CSS
- ESLint
- React Router
- React Icons

## Project Structure
- `src/` - Main source code
  - `pages/` - Page components (Home, LandingPage, CourseDetail, etc.)
  - `contexts/` - React Contexts (AuthContext)
  - `lib/` - Utility libraries (e.g., Stripe integration)
  - `firebase.js` - Firebase configuration and helpers
- `api/` - Serverless API endpoints (Stripe checkout session)
- `public/` - Static assets

## License
This project is for private, educational use only.
