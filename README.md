# 🚀 FinTracker — Premium Finance & Expense Manager

![FinTracker Banner](https://via.placeholder.com/1200x600/6366f1/ffffff?text=FinTracker+-+Smart+Finance+Manager)

FinTracker is a modern, production-quality finance management web application inspired by the UI/UX of top fintech apps like Google Pay and PhonePe. Designed to be mobile-first and deeply responsive, it features sleek premium interfaces, glassmorphism UI cards, seamless interactions, Framer Motion animations, and real-time backend updates using Firebase.

Whether managing a personal budget, tracking multi-category expenses, or reviewing monthly financial analytics, FinTracker centralizes your finances into one beautiful dashboard.

---

## ✨ Features

*   **🔒 Secure Authentication:** E-mail/password registration and login with Firebase Auth.
*   **📱 Fintech-Inspired UI:** Mobile-first design with a bottom navigation bar just like premium banking apps.
*   **💸 Dynamic Dashboard:** Beautiful gradient "Wallet" card displaying live income vs. expense data, plus quick action buttons.
*   **📊 Rich Analytics & Charts:** Visualize spending patterns with donut pie charts and bar graphs (Daily/Weekly/Monthly) using Recharts.
*   **🎯 Smart Budgeting:** Set daily, weekly, or monthly spending limits with color-coded progress bars and real-time "Budget Alert" toast notifications.
*   **💳 Simulated P2P Payments:** Sleek visual forms to record outgoing payments and assign categories instantly.
*   **📷 QR Code Scanner:** Built-in camera scanner (via `html5-qrcode`) to scan physical QR codes and mock a rapid payment flow.
*   **🏷️ Custom Categories:** Add, edit, or delete personal tracking categories complete with customizable icons and hex colors.
*   **🌙 Dark Mode:** Effortless toggling between crisp Light Mode and immersive Dark Mode.

---

## 🛠️ Tech Stack

**Frontend Framework:** React 19 + Vite  
**Styling Ecosystem:** Tailwind CSS v3 (Custom Utility Config)  
**Routing Flow:** React Router DOM v7  
**State Management:** React Context API  
**Animations:** Framer Motion  
**Backend & Database:** Firebase (Auth & Firestore)  
**Data Visualization:** Recharts  
**Alerts/Notifications:** React Hot Toast  

---

## 🏗️ Getting Started

### 1. Clone & Install
Clone the repository, then install all dependencies and start the Vite dev server:

```bash
git clone https://github.com/YOUR_USERNAME/fintracker.git
cd fintracker
npm install
npm run dev
```

### 2. Firebase Database Setup
FinTracker requires a Firebase project for data persistence.
1. Open up `src/config/firebase.js` in your editor.
2. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
3. Register a Web App, enable **Email/Password Auth**, and initialize a **Firestore** Database.
4. Add your configuration details into the `firebaseConfig` block inside `firebase.js`.
5. *Check `FIREBASE_SETUP.md` for a comprehensive, step-by-step breakdown.*

### 3. Firestore Security Rules
To ensure data security, you must publish these rules in your Firebase Firestore settings under the **Rules** tab:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## 🚀 Deployment

This application is ready to be deployed to platforms like **Vercel** or **Netlify**.

1. Connect your GitHub repository to Vercel.
2. Select the **Vite** preset template.
3. Keep Firebase credentials safely injected via `.env` variables if you intend to deploy to production.
4. Click **Deploy**.

---

**Crafted with ❤️ to redefine how personal finance looks and feels.**
