# Research Information Management System (RIMS) - Implementation Plan

## 🎯 Project Overview

A comprehensive role-based research management system with:
- **Two Roles**: User and Admin
- **Backend**: Firebase (Auth, Firestore, Storage, Cloud Functions)
- **Frontend**: React + TypeScript
- **Key Features**: Approval-driven workflow, dynamic forms, real-time statistics

---

## 📋 Phase 1: Firebase Setup & Configuration

### 1.1 Firebase Configuration
- [x] Firebase SDK installed
- [ ] Create proper Firebase config with environment variables
- [ ] Initialize Firebase Auth, Firestore, and Storage
- [ ] Set up Firebase Security Rules for role-based access
- [ ] Configure Firestore indexes

### 1.2 Firestore Database Schema

#### Collections Structure:

**users** (collection)
```typescript
{
  uid: string,
  email: string,
  displayName: string,
  role: 'user' | 'admin',
  photoURL?: string,
  department?: string,
  institution?: string,
  researchInterests?: string[],
  linkedinUrl?: string,
  scholarUrl?: string,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**records** (collection)
```typescript
{
  id: string,
  userId: string,
  type: 'ipr' | 'journal' | 'conference' | 'book' | 'consultancy' | 'award' | 'workshop',
  status: 'pending' | 'approved' | 'rejected',
  createdAt: Timestamp,
  updatedAt: Timestamp,
  approvedAt?: Timestamp,
  approvedBy?: string,
  rejectedAt?: Timestamp,
  rejectedBy?: string,
  
  // Common fields
  title: string,
  year: number,
  description?: string,
  
  // Type-specific fields (stored as nested object)
  data: {
    // IPR fields
    patentNumber?: string,
    filingDate?: string,
    grantDate?: string,
    inventors?: string[],
    
    // Journal fields
    journalName?: string,
    volume?: string,
    issue?: string,
    pages?: string,
    doi?: string,
    impactFactor?: number,
    authors?: string[],
    
    // Conference fields
    conferenceName?: string,
    location?: string,
    conferenceDate?: string,
    proceedingsTitle?: string,
    
    // Book fields
    publisher?: string,
    isbn?: string,
    edition?: string,
    
    // Consultancy fields
    clientName?: string,
    projectValue?: number,
    duration?: string,
    
    // Award fields
    awardingBody?: string,
    awardDate?: string,
    
    // Workshop fields
    eventType?: 'workshop' | 'seminar' | 'fdp' | 'keynote',
    organizer?: string,
    eventDate?: string,
    role?: string
  },
  
  // File attachments
  files: {
    fileName: string,
    fileUrl: string,
    fileType: string,
    uploadedAt: Timestamp
  }[]
}
```

### 1.3 Firebase Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return isAuthenticated() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create: if isAdmin();
      allow update: if isAdmin() || isOwner(userId);
      allow delete: if isAdmin();
    }
    
    // Records collection
    match /records/{recordId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update: if isAdmin() || (isOwner(resource.data.userId) && resource.data.status == 'pending');
      allow delete: if isAdmin() || (isOwner(resource.data.userId) && resource.data.status == 'pending');
    }
  }
}
```

---

## 📋 Phase 2: Type Definitions & Shared Utilities

### 2.1 Core Types
- [ ] User types
- [ ] Record types (all 7 categories)
- [ ] Form types
- [ ] API response types

### 2.2 Firebase Services
- [ ] Auth service (login, logout, password reset)
- [ ] User service (CRUD operations)
- [ ] Record service (CRUD operations)
- [ ] Storage service (file upload/download)

### 2.3 Custom Hooks
- [ ] useAuth (authentication state)
- [ ] useUser (user profile)
- [ ] useRecords (fetch user/all records)
- [ ] useStats (calculate statistics)
- [ ] useFileUpload (handle file uploads)

---

## 📋 Phase 3: Authentication & Authorization

### 3.1 Auth Components
- [ ] Login page
- [ ] Password reset page
- [ ] Protected route wrapper
- [ ] Role-based route guard

### 3.2 Auth Context
- [ ] AuthProvider with Firebase Auth
- [ ] User role detection
- [ ] Persistent auth state

---

## 📋 Phase 4: User Portal

### 4.1 User Dashboard
- [ ] **Top Section**: Statistics cards
  - [ ] Count approved records by type
  - [ ] Display 7 stat cards (IPR, Journals, Conferences, Books, Consultancy, Awards, Workshops)
  
- [ ] **Middle Section**: Category-wise showcase
  - [ ] Create RecordCard component
  - [ ] Group records by category
  - [ ] Implement card click → modal with full details
  - [ ] Display attached files with download links

- [ ] **Floating Add Button**
  - [ ] Category selector dialog
  - [ ] Dynamic form based on selected type
  - [ ] File upload integration
  - [ ] Form validation with Zod
  - [ ] Submit to Firestore with status='pending'

### 4.2 User Profile
- [ ] Profile dropdown in header
- [ ] Profile view/edit modal
- [ ] Photo upload to Firebase Storage
- [ ] Update user details
- [ ] Logout functionality

### 4.3 Dynamic Forms (7 Types)

#### IPR Form
- Title, Patent Number, Filing Date, Grant Date, Inventors, Description, Files

#### Journal Form
- Title, Journal Name, Authors, Year, Volume, Issue, Pages, DOI, Impact Factor, Files

#### Conference Form
- Title, Conference Name, Authors, Year, Location, Conference Date, Proceedings, Files

#### Book Form
- Title, Authors, Publisher, Year, ISBN, Edition, Description, Files

#### Consultancy Form
- Title, Client Name, Year, Project Value, Duration, Description, Files

#### Award Form
- Title, Awarding Body, Award Date, Year, Description, Files

#### Workshop Form
- Title, Event Type, Organizer, Event Date, Year, Role, Description, Files

---

## 📋 Phase 5: Admin Portal

### 5.1 Admin Dashboard (Overview)
- [ ] System-wide statistics
  - [ ] Total users count
  - [ ] Total approved records count
  - [ ] Year-wise breakdown
  - [ ] Category comparison charts (using Recharts)
  - [ ] Recent activity timeline

### 5.2 User Management Page
- [ ] Users table with search/filter
- [ ] Create user dialog (Firebase Auth)
  - [ ] Email, password, name, role, department
  - [ ] Send password reset email option
- [ ] Edit user details
- [ ] Delete user (with confirmation)
- [ ] Click user → view full profile + all their records

### 5.3 Records Management Page
- [ ] All records table
- [ ] Filters:
  - [ ] Type (dropdown)
  - [ ] Year (dropdown)
  - [ ] Status (Approved/Pending/Rejected)
  - [ ] User (search)
- [ ] Click row → open record details card
- [ ] Actions:
  - [ ] Approve (change status to 'approved')
  - [ ] Reject (change status to 'rejected')
  - [ ] Edit record
  - [ ] Delete record
- [ ] Admin can also add new records

### 5.4 Recent Requests Page
- [ ] Display only pending records
- [ ] Card-based layout
- [ ] Quick actions:
  - [ ] Approve button
  - [ ] Reject button
  - [ ] View full details
- [ ] Real-time updates (Firestore listeners)

---

## 📋 Phase 6: Shared Components

### 6.1 UI Components
- [ ] RecordCard (displays record summary)
- [ ] RecordDetailsModal (full record view)
- [ ] StatCard (for statistics display)
- [ ] FileUploader (drag-drop file upload)
- [ ] FileList (display uploaded files with download)
- [ ] ConfirmDialog (for delete confirmations)
- [ ] DataTable (reusable table with sorting/filtering)

### 6.2 Form Components
- [ ] DynamicRecordForm (renders form based on type)
- [ ] FormField components (text, select, date, file, etc.)
- [ ] Form validation schemas (Zod)

---

## 📋 Phase 7: Routing & Navigation

### 7.1 Routes Structure
```
/login
/forgot-password

/user (Protected - User Role)
  /user/dashboard
  /user/profile

/admin (Protected - Admin Role)
  /admin/dashboard
  /admin/users
  /admin/records
  /admin/requests
```

### 7.2 Navigation
- [ ] User sidebar/header navigation
- [ ] Admin sidebar/header navigation
- [ ] Role-based menu items
- [ ] Active route highlighting

---

## 📋 Phase 8: Advanced Features

### 8.1 Real-time Updates
- [ ] Firestore listeners for live data
- [ ] Optimistic UI updates
- [ ] Toast notifications for actions

### 8.2 File Management
- [ ] Upload files to Firebase Storage
- [ ] Organize files by user/record
- [ ] Generate download URLs
- [ ] Delete files when record is deleted

### 8.3 Search & Filtering
- [ ] Global search across records
- [ ] Advanced filters (multi-select)
- [ ] Sort by date, title, status

### 8.4 Analytics & Charts
- [ ] Year-wise publication trends
- [ ] Category distribution (pie/bar charts)
- [ ] User contribution comparison
- [ ] Export data to CSV

---

## 📋 Phase 9: Testing & Deployment

### 9.1 Testing
- [ ] Test user workflows
- [ ] Test admin workflows
- [ ] Test file uploads
- [ ] Test role-based access
- [ ] Test form validations

### 9.2 Deployment
- [ ] Set up environment variables
- [ ] Deploy to Netlify/Vercel
- [ ] Configure Firebase for production
- [ ] Set up custom domain (optional)

---

## 🎨 Design Guidelines

### Color Palette (Premium Theme)
- **Background**: Off-white (#FAFAF9) / Deep black (#0A0A0A)
- **Primary**: Emerald/Teal tones (not blue)
- **Accent**: Gold/Amber for highlights
- **Text**: Slate-800 (light mode), Slate-100 (dark mode)

### UI Principles
- Clean, modern cards with subtle shadows
- Smooth animations (Framer Motion)
- Responsive design (mobile-first)
- Accessible (ARIA labels, keyboard navigation)
- Consistent spacing and typography

---

## 📦 Tech Stack Summary

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4, Shadcn UI
- **State**: Zustand, React Query
- **Forms**: React Hook Form, Zod
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Animations**: Framer Motion

---

## 🚀 Implementation Order

1. ✅ Firebase setup & configuration
2. ✅ Type definitions
3. ✅ Firebase services (auth, firestore, storage)
4. ✅ Authentication flow
5. ✅ User dashboard (stats + records showcase)
6. ✅ Dynamic forms (all 7 types)
7. ✅ User profile
8. ✅ Admin dashboard (overview)
9. ✅ Admin user management
10. ✅ Admin records management
11. ✅ Admin recent requests
12. ✅ File upload/download
13. ✅ Real-time updates
14. ✅ Charts & analytics
15. ✅ Testing & deployment

---

## 📝 Notes

- **No self-registration**: Only admins can create user accounts
- **Approval workflow**: All records start as 'pending' and need admin approval
- **File storage**: Organize files as `/users/{userId}/records/{recordId}/{filename}`
- **Security**: Implement proper Firebase Security Rules
- **Performance**: Use pagination for large datasets
- **Accessibility**: Follow WCAG 2.1 guidelines

