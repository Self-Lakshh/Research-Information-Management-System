# Manual Firestore User Data

## Instructions

1. Go to Firebase Console: https://console.firebase.google.com/project/spsu-rims/firestore
2. Click on "Firestore Database" in the left sidebar
3. Click "Start collection"
4. Collection ID: `users`
5. Click "Next"
6. Add documents using the data below

---

## User 1: Regular User (test@test.com)

### First, create the Firebase Auth user:
1. Go to Authentication → Users
2. Click "Add user"
3. Email: `test@test.com`
4. Password: `test123`
5. Click "Add user"
6. **Copy the UID** (you'll need it for the next step)

### Then, add Firestore document:
**Document ID:** [Paste the UID you copied above]

**Fields:**
```json
{
  "uid": "[PASTE_UID_HERE]",
  "email": "test@test.com",
  "name": "Test User",
  "user_role": "user",
  "phone_number": "+1234567890",
  "address": "123 Test Street, Test City",
  "designation": "Assistant Professor",
  "department": "Computer Science",
  "is_active": true,
  "created_at": [Click "timestamp" type and use current time],
  "updated_at": [Click "timestamp" type and use current time]
}
```

---

## User 2: Admin User (admin@test.com)

### First, create the Firebase Auth user:
1. Go to Authentication → Users
2. Click "Add user"
3. Email: `admin@test.com`
4. Password: `admin123`
5. Click "Add user"
6. **Copy the UID**

### Then, add Firestore document:
**Document ID:** [Paste the UID you copied above]

**Fields:**
```json
{
  "uid": "[PASTE_UID_HERE]",
  "email": "admin@test.com",
  "name": "Admin User",
  "user_role": "admin",
  "phone_number": "+1234567891",
  "address": "456 Admin Avenue, Admin City",
  "designation": "Dean",
  "department": "Administration",
  "is_active": true,
  "created_at": [Click "timestamp" type and use current time],
  "updated_at": [Click "timestamp" type and use current time]
}
```

---

## Field Types in Firestore

When adding fields manually in Firebase Console:

- `uid`: string
- `email`: string
- `name`: string
- `user_role`: string
- `phone_number`: string
- `address`: string
- `designation`: string
- `department`: string
- `is_active`: boolean
- `created_at`: timestamp
- `updated_at`: timestamp

---

## Quick Copy-Paste Format (for Firestore Console)

### For test@test.com (Regular User)
After creating the Auth user and copying the UID, use this in Firestore:

| Field | Type | Value |
|-------|------|-------|
| uid | string | [PASTE_UID] |
| email | string | test@test.com |
| name | string | Test User |
| user_role | string | user |
| phone_number | string | +1234567890 |
| address | string | 123 Test Street, Test City |
| designation | string | Assistant Professor |
| department | string | Computer Science |
| is_active | boolean | true |
| created_at | timestamp | [current time] |
| updated_at | timestamp | [current time] |

### For admin@test.com (Admin User)
After creating the Auth user and copying the UID, use this in Firestore:

| Field | Type | Value |
|-------|------|-------|
| uid | string | [PASTE_UID] |
| email | string | admin@test.com |
| name | string | Admin User |
| user_role | string | admin |
| phone_number | string | +1234567891 |
| address | string | 456 Admin Avenue, Admin City |
| designation | string | Dean |
| department | string | Administration |
| is_active | boolean | true |
| created_at | timestamp | [current time] |
| updated_at | timestamp | [current time] |

---

## Test Credentials

After setup, you can login with:

**Regular User:**
- Email: `test@test.com`
- Password: `test123`
- Will redirect to: `/user/dashboard`

**Admin User:**
- Email: `admin@test.com`
- Password: `admin123`
- Will redirect to: `/admin/dashboard`
