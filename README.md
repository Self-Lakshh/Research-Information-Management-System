# 🚀 Research Information Management System (RIMS)

> A premium, modern, and comprehensive platform for managing academic research contributions.

![License](https://img.shields.io/badge/license-MIT-blue.svg) ![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white) ![Firebase](https://img.shields.io/badge/Firebase-11.0-FFCA28?logo=firebase&logoColor=black) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38B2AC?logo=tailwind-css&logoColor=white)

---

## 🌟 Overview

**RIMS** is a state-of-the-art web application designed to streamline the management of research activities within academic institutions. Built with the latest web technologies, it offers a seamless, role-based experience for both **Faculty Members** (Users) and **Administrators**.

The system features a **premium glassmorphism design**, responsive layouts, and real-time data synchronization, ensuring that research data is not just managed, but showcased.

---

## ✨ Key Features

### 🔐 **Secure Authentication & Roles**
*   **Role-Based Access Control (RBAC)**: Distinct dashboards and capabilities for **Admins** and **Users**.
*   **Secure Login**: Powered by Firebase Authentication with manual session management.

### 📊 **Interactive Dashboards**
*   **User Dashboard**: Visual overview of personal research contributions with dynamic charts and stats.
*   **Admin Dashboard**: Comprehensive analytics of institutional research output.

### 📝 **Comprehensive Record Management**
Manage the entire lifecycle of various research outputs:
*   💡 **Intellectual Property Rights (IPR)**: Patents, Copyrights, Trademarks.
*   📰 **Journal Publications**: Track citations, impact factors, and more.
*   🗣️ **Conferences**: Manage paper presentations and proceedings.
*   📚 **Books & Chapters**: Catalog published works.
*   💼 **Consultancy Projects**: Track industrial collaborations and grants.
*   🏆 **Awards & Recognitions**: Showcase academic achievements.
*   🎓 **PhD Students**: Monitor supervision and student progress.
*   🎤 **Events**: Workshops, FDPs, and Seminars.

### 🎨 **Premium UI/UX**
*   **Glassmorphism Design**: Modern, translucent aesthetic.
*   **Dark Mode Support**: Fully integrated dark theme.
*   **Responsive**: Flawless experience across Desktop, Tablet, and Mobile.
*   **Animations**: Smooth transitions using **Framer Motion**.

---

## 🛠️ Technology Stack

Built with a focus on performance, scalability, and developer experience.

| Category | Technologies |
|----------|--------------|
| **Frontend Framework** | [React 19](https://react.dev/) |
| **Build Tool** | [Vite](https://vitejs.dev/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + [Radix UI](https://www.radix-ui.com/) |
| **State Management** | [Zustand](https://github.com/pmndrs/zustand) + [TanStack Query](https://tanstack.com/query/latest) |
| **Backend / DB** | [Firebase](https://firebase.google.com/) (Firestore, Auth, Storage) |
| **Visuals** | [Lucide React](https://lucide.dev/) (Icons), [Recharts](https://recharts.org/) (Charts) |

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
*   Node.js (v18 or higher)
*   npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Self-Lakshh/Research-Information-Management-System.git
    cd Research-Information-Management-System
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory and add your Firebase configuration:
    ```env
    VITE_FIREBASE_API_KEY=your_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    VITE_FIREBASE_APP_ID=your_app_id
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📂 Project Structure

```
src/
├── @types/          # TypeScript type definitions
├── auth/            # Authentication logic & context
├── components/      # Reusable UI components (Shadcn, Shared)
├── configs/         # App, Navigation, & Route configurations
├── constants/       # Static constants (Roles, etc.)
├── hooks/           # Custom React hooks (Data fetching, etc.)
├── layouts/         # Page layouts (Modern, Deck, Simple)
├── services/        # API services (Firebase integration)
├── store/           # Global state (Zustand)
├── utils/           # Helper functions
└── views/           # Page views (Auth, User, Admin)
```

---

## 🤝 Contribution

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📬 Contact

For any queries or support, please contact:

**Developer Team**
*   GitHub: [Self-Lakshh](https://github.com/Self-Lakshh)

---

## 🌍 Deployment

For detailed instructions on deploying to Netlify and configuring Firebase, please refer to the [Deployment Guide](DEPLOYMENT_GUIDE.md).

---

*Made with ❤️ for Academic Excellence*
